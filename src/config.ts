export const APP_NAME = "NordNotes";

export const PLATFORM_FEE_PERCENTAGE = 0.1;

export const STORAGE_KEYS = {
  users: "nordnotes_users",
  documents: "nordnotes_documents",
  transactions: "nordnotes_transactions",
  reviews: "nordnotes_reviews",
  currentUserId: "nordnotes_currentUserId",
  seedVersion: "nordnotes_seed_version"
} as const;

export const SUPPORTED_COUNTRIES = [
  { code: "NO", label: "Norge" },
  { code: "SE", label: "Sverige" },
  { code: "DK", label: "Danmark" }
] as const;

export const DEFAULT_SEED_VERSION = "2025-11-13";

