// ==========================================
// USER TYPES
// ==========================================

export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  emailVerified: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  workspaces: WorkspaceMember[];
}

// ==========================================
// AUTH TYPES
// ==========================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

// ==========================================
// WORKSPACE TYPES
// ==========================================

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type WorkspaceRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER';

export interface WorkspaceMember {
  id: string;
  userId: string;
  workspaceId: string;
  role: WorkspaceRole;
  user: User;
  workspace: Workspace;
  joinedAt: Date;
}

export interface WorkspaceInvite {
  id: string;
  email: string;
  workspaceId: string;
  role: WorkspaceRole;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// ==========================================
// DOCUMENT TYPES
// ==========================================

export interface Document {
  id: string;
  title: string;
  content: string | null;
  workspaceId: string;
  createdById: string;
  parentId: string | null;
  icon: string | null;
  coverImage: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==========================================
// BOARD TYPES
// ==========================================

export interface Board {
  id: string;
  title: string;
  description: string | null;
  workspaceId: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  columns: Column[];
}

export interface Column {
  id: string;
  title: string;
  order: number;
  boardId: string;
  cards: Card[];
}

export interface Card {
  id: string;
  title: string;
  description: string | null;
  order: number;
  columnId: string;
  assigneeIds: string[];
  dueDate: Date | null;
  labels: CardLabel[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CardLabel {
  id: string;
  name: string;
  color: string;
}

// ==========================================
// CHAT TYPES
// ==========================================

export type ChannelType = 'WORKSPACE' | 'DIRECT' | 'GROUP';

export interface Channel {
  id: string;
  name: string | null;
  type: ChannelType;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
  members: ChannelMember[];
}

export interface ChannelMember {
  id: string;
  userId: string;
  channelId: string;
  user: User;
}

export interface Message {
  id: string;
  content: string;
  channelId: string;
  senderId: string;
  sender: User;
  parentId: string | null;
  isEdited: boolean;
  createdAt: Date;
  updatedAt: Date;
  reactions: MessageReaction[];
}

export interface MessageReaction {
  id: string;
  emoji: string;
  userId: string;
  messageId: string;
}

// ==========================================
// NOTIFICATION TYPES
// ==========================================

export type NotificationType = 
  | 'MENTION'
  | 'ASSIGNMENT'
  | 'COMMENT'
  | 'INVITE'
  | 'DUE_DATE'
  | 'MESSAGE';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  userId: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
}

// ==========================================
// FILE TYPES
// ==========================================

export interface File {
  id: string;
  name: string;
  url: string;
  size: number;
  mimeType: string;
  workspaceId: string;
  uploadedById: string;
  folderId: string | null;
  createdAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  workspaceId: string;
  parentId: string | null;
  createdAt: Date;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ==========================================
// SOCKET EVENT TYPES
// ==========================================

export interface SocketEvents {
  // Document events
  'document:join': { documentId: string };
  'document:leave': { documentId: string };
  'document:update': { documentId: string; content: string };
  'document:cursor': { documentId: string; cursor: CursorPosition };
  
  // Chat events
  'chat:join': { channelId: string };
  'chat:leave': { channelId: string };
  'chat:message': { channelId: string; message: Message };
  'chat:typing': { channelId: string; userId: string; isTyping: boolean };
  
  // Board events
  'board:join': { boardId: string };
  'board:leave': { boardId: string };
  'board:card-move': { cardId: string; columnId: string; order: number };
  
  // Notification events
  'notification:new': Notification;
}

export interface CursorPosition {
  userId: string;
  userName: string;
  position: { x: number; y: number };
  color: string;
}
