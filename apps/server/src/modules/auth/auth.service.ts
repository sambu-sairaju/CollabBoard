import { query, queryOne } from '../../lib/db';
import { hashPassword, comparePassword } from '../../lib/password';
import { generateTokens, verifyRefreshToken, type AuthTokens } from '../../lib/jwt';
import { randomUUID } from 'crypto';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  password?: string | null;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  tokens: AuthTokens;
}

class AuthService {
  // Register a new user
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, password, name } = input;

    // Check if user already exists
    const existingUser = await queryOne<User>(
      'SELECT id, email, name, avatar FROM "User" WHERE email = $1',
      [email.toLowerCase()]
    );

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);
    const userId = randomUUID();
    const now = new Date();

    // Create user
    await query(
      `INSERT INTO "User" (id, email, name, password, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, email.toLowerCase(), name, hashedPassword, now, now]
    );

    // Create account record for credentials
    await query(
      `INSERT INTO "Account" (id, "userId", type, provider, "providerAccountId") 
       VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), userId, 'credentials', 'email', userId]
    );

    const user = { id: userId, email: email.toLowerCase(), name, avatar: null };

    // Generate tokens
    const tokens = generateTokens({ userId: user.id, email: user.email });

    // Create session
    await query(
      `INSERT INTO "Session" (id, "userId", token, "expiresAt", "createdAt") 
       VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), userId, tokens.refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), now]
    );

    return { user, tokens };
  }

  // Login with email and password
  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    // Find user
    const user = await queryOne<User>(
      'SELECT id, email, name, avatar, password FROM "User" WHERE email = $1',
      [email.toLowerCase()]
    );

    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateTokens({ userId: user.id, email: user.email });

    // Create session
    await query(
      `INSERT INTO "Session" (id, "userId", token, "expiresAt", "createdAt") 
       VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), user.id, tokens.refreshToken, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), new Date()]
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new Error('Invalid or expired refresh token');
    }

    // Check if session exists and is valid
    const session = await queryOne<{ id: string }>(
      `SELECT id FROM "Session" WHERE token = $1 AND "userId" = $2 AND "expiresAt" > NOW()`,
      [refreshToken, payload.userId]
    );

    if (!session) {
      throw new Error('Session not found or expired');
    }

    // Generate new access token
    const tokens = generateTokens({ userId: payload.userId, email: payload.email });

    return { accessToken: tokens.accessToken };
  }

  // Logout - invalidate session
  async logout(refreshToken: string): Promise<void> {
    await query('DELETE FROM "Session" WHERE token = $1', [refreshToken]);
  }

  // Get current user by ID
  async getCurrentUser(userId: string) {
    const user = await queryOne<User>(
      `SELECT id, email, name, avatar, "emailVerified", "createdAt" 
       FROM "User" WHERE id = $1`,
      [userId]
    );

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId: string, data: { name?: string; avatar?: string }) {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(data.name);
    }
    if (data.avatar !== undefined) {
      updates.push(`avatar = $${paramIndex++}`);
      values.push(data.avatar);
    }

    updates.push(`"updatedAt" = $${paramIndex++}`);
    values.push(new Date());

    values.push(userId);

    await query(
      `UPDATE "User" SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    const user = await queryOne<User>(
      'SELECT id, email, name, avatar FROM "User" WHERE id = $1',
      [userId]
    );

    return user;
  }
}

export const authService = new AuthService();
