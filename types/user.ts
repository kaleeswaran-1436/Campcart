import type { UserRole, VerificationStatus, Department } from "./enums";
import type { ID, Timestamp } from "./listing";

export interface User {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  college: string;
  rollNumber?: string;
  department?: Department;
  batch?: string;               // e.g. "2022-2026"
  role: UserRole;
  verification: VerificationStatus;
  rating: number;
  totalSales: number;
  totalPurchases: number;
  bio?: string;
  joinedAt: Timestamp;
  lastSeenAt?: Timestamp;
}

export type UserPublicProfile = Pick<
  User,
  | "id"
  | "name"
  | "avatar"
  | "college"
  | "department"
  | "verification"
  | "rating"
  | "totalSales"
  | "joinedAt"
>;

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: Timestamp;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  college: string;
  rollNumber: string;
  department: Department;
}

export interface VerifyIdPayload {
  idCardUrl: string;
  selfieUrl?: string;
}
