/**
 * Type definitions for the BuildInPublic Mini App
 */

// Deprecated role types removed

// MVP Cast structure
export interface MVPCast {
  [key: string]: string;
}

// Legacy interfaces for roles were removed

// Base profile data structure
export interface UserProfile {
  Name: string;
  JoinDate: string;
  Summary: string;
  Description: string;
  NumberOfCasts: number;
  Engagement: number;
  MVPCasts: MVPCast[];
}

// Extended profile with role-specific data
export interface ExtendedUserProfile extends UserProfile {
  // Optional fields
  BuilderLevel?: string;
  Vibe?: string;
  SuperPower?: string;
  BuildStreak?: number;
  CommunityImpact?: string;
  EmojiFlair?: string;
  BuilderArchetype?: string;
  FavoriteTopics?: string[];
  BuildingMood?: string;
}

// API response structure
export interface APIResponse {
  success: boolean;
  message: string;
  data: ExtendedUserProfile;
}

// Loading state
export interface LoadingState {
  isLoading: boolean;
  message: string;
  fact: string;
}

// App state
export interface AppState {
  profile: ExtendedUserProfile | null;
  loading: LoadingState;
  error: string | null;
}

// Project types
export interface Project {
  builderId: string; // Farcaster fid
  projectName: string;
  projectId: string; // unique slug/id
  description: string;
  category: string;
  projectStartDate: string; // ISO date
  projectEvmAddress?: string;
  websiteLink?: string;
  whatHasBeenAlreadyBuilt?: string;
  githubUrl?: string;
  xUrl?: string;
  farcasterUrl?: string;
  createdAt?: string; // ISO timestamp
}

export interface ProjectMilestone {
  projectId: string;
  title: string;
  description: string;
  targetDate: string; // ISO date
  createdAt?: string; // ISO timestamp
}

export interface BuilderSummary {
  builderId: string;
  numProjects: number;
  supportersCount?: number; // placeholder for future enrichment
  superfluidTotal?: number; // placeholder (aggregated amount)
}
