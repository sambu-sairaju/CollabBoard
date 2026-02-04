import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { query, queryOne } from '../lib/db';
import { randomUUID } from 'crypto';

interface OAuthProfile {
  id: string;
  displayName: string;
  emails?: Array<{ value: string; verified?: boolean }>;
  photos?: Array<{ value: string }>;
}

// Helper function to find or create user from OAuth profile
async function findOrCreateOAuthUser(
  provider: 'google' | 'github',
  profile: OAuthProfile,
  accessToken: string,
  refreshToken?: string
) {
  const email = profile.emails?.[0]?.value?.toLowerCase();
  const avatar = profile.photos?.[0]?.value;
  const name = profile.displayName;
  const providerAccountId = profile.id;

  if (!email) {
    throw new Error('Email is required for OAuth login');
  }

  // Check if user exists with this email
  let user = await queryOne<{ id: string; email: string; name: string | null; avatar: string | null }>(
    'SELECT id, email, name, avatar FROM "User" WHERE email = $1',
    [email]
  );

  const now = new Date();

  if (!user) {
    // Create new user
    const userId = randomUUID();
    await query(
      `INSERT INTO "User" (id, email, name, avatar, "emailVerified", "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, email, name, avatar, now, now, now]
    );

    user = { id: userId, email, name, avatar: avatar || null };
  }

  // Check if this OAuth account is already linked
  const existingAccount = await queryOne<{ id: string }>(
    'SELECT id FROM "Account" WHERE provider = $1 AND "providerAccountId" = $2',
    [provider, providerAccountId]
  );

  if (!existingAccount) {
    // Link OAuth account to user
    await query(
      `INSERT INTO "Account" (id, "userId", type, provider, "providerAccountId", "access_token", "refresh_token")
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [randomUUID(), user.id, 'oauth', provider, providerAccountId, accessToken, refreshToken || null]
    );
  } else {
    // Update tokens
    await query(
      `UPDATE "Account" SET "access_token" = $1, "refresh_token" = $2 
       WHERE provider = $3 AND "providerAccountId" = $4`,
      [accessToken, refreshToken || null, provider, providerAccountId]
    );
  }

  return user;
}

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/google/callback`,
        scope: ['profile', 'email'],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await findOrCreateOAuthUser('google', profile, accessToken, refreshToken);
          done(null, user || undefined);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
  console.log('✅ Google OAuth configured');
} else {
  console.log('⚠️  Google OAuth not configured (missing credentials)');
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/auth/github/callback`,
        scope: ['user:email'],
      },
      async (accessToken: string, refreshToken: string, profile: OAuthProfile, done: (err: Error | null, user?: unknown) => void) => {
        try {
          const user = await findOrCreateOAuthUser('github', profile, accessToken, refreshToken);
          done(null, user);
        } catch (error) {
          done(error as Error);
        }
      }
    )
  );
  console.log('✅ GitHub OAuth configured');
} else {
  console.log('⚠️  GitHub OAuth not configured (missing credentials)');
}

// Serialize user for session
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user as Express.User);
});

export default passport;
