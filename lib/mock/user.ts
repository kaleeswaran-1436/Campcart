/**
 * CampCart — Mock Current User Profile
 * Used by dashboard, profile, and listing ownership checks.
 */

import type { User } from "@/types/user";
import { VerificationStatus, UserRole } from "@/types/enums";

export const MOCK_CURRENT_USER_ID = "current-user";

export const MOCK_CURRENT_USER: User = {
  id: MOCK_CURRENT_USER_ID,
  name: "Aryan Mehta",
  email: "aryan.mehta@srmist.edu.in",
  phone: "9876543210",
  avatar: "https://i.pravatar.cc/150?u=current-user",
  college: "SRM Institute of Science & Technology",
  rollNumber: "RA2211003010042",
  department: "Computer Science & Engineering",
  batch: "2022-2026",
  role: UserRole.USER,
  verification: VerificationStatus.VERIFIED,
  rating: 4.7,
  totalSales: 5,
  totalPurchases: 12,
  bio: "3rd year CSE student. Selling textbooks and lab materials from past semesters.",
  joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180).toISOString(), // 6 months ago
  lastSeenAt: new Date().toISOString(),
};

/** Mock public profiles for other users */
export const MOCK_USERS: Record<string, Partial<User>> = {
  "seller-1": {
    id: "seller-1",
    name: "Aditya K.",
    avatar: "https://i.pravatar.cc/150?u=seller1",
    college: "SRM IST Chennai",
    department: "Electronics & Communication Engineering",
    batch: "2021-2025",
    verification: VerificationStatus.VERIFIED,
    rating: 4.8,
    totalSales: 12,
    totalPurchases: 3,
    bio: "Final year ECE student. Selling 3rd and 4th year materials.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 365).toISOString(),
  },
  "seller-2": {
    id: "seller-2",
    name: "Priya S.",
    avatar: "https://i.pravatar.cc/150?u=seller2",
    college: "SRM IST Chennai",
    department: "Computer Science & Engineering",
    batch: "2023-2027",
    verification: VerificationStatus.VERIFIED,
    rating: 5.0,
    totalSales: 3,
    totalPurchases: 7,
    bio: "2nd year CSE student. Love buying used textbooks at great prices!",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 200).toISOString(),
  },
  "seller-3": {
    id: "seller-3",
    name: "Rahul M.",
    avatar: "https://i.pravatar.cc/150?u=seller3",
    college: "SRM IST Chennai",
    department: "Mechanical Engineering",
    batch: "2022-2026",
    verification: VerificationStatus.PENDING,
    rating: 4.5,
    totalSales: 8,
    totalPurchases: 2,
    bio: "Mech student, selling drafter and drawing supplies.",
    joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 300).toISOString(),
  },
};
