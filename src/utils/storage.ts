import { DEFAULT_SEED_VERSION, STORAGE_KEYS } from "../config";
import type { Document, Review, Transaction, User } from "../types";

const isBrowser = typeof window !== "undefined";

const safeParse = <T>(raw: string | null, fallback: T): T => {
  if (!raw) {
    return fallback;
  }
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn("Failed to parse storage payload", error);
    return fallback;
  }
};

const setItem = (key: string, value: unknown) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const getItem = <T>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  const raw = window.localStorage.getItem(key);
  return safeParse<T>(raw, fallback);
};

export const storage = {
  getUsers: () => getItem<User[]>(STORAGE_KEYS.users, []),
  setUsers: (value: User[]) => setItem(STORAGE_KEYS.users, value),

  getDocuments: () => getItem<Document[]>(STORAGE_KEYS.documents, []),
  setDocuments: (value: Document[]) => setItem(STORAGE_KEYS.documents, value),

  getTransactions: () => getItem<Transaction[]>(STORAGE_KEYS.transactions, []),
  setTransactions: (value: Transaction[]) => setItem(STORAGE_KEYS.transactions, value),

  getReviews: () => getItem<Review[]>(STORAGE_KEYS.reviews, []),
  setReviews: (value: Review[]) => setItem(STORAGE_KEYS.reviews, value),

  getCurrentUserId: () =>
    isBrowser ? window.localStorage.getItem(STORAGE_KEYS.currentUserId) : null,
  setCurrentUserId: (value: string | null) => {
    if (!isBrowser) return;
    if (value) {
      window.localStorage.setItem(STORAGE_KEYS.currentUserId, value);
    } else {
      window.localStorage.removeItem(STORAGE_KEYS.currentUserId);
    }
  },

  getSeedVersion: () =>
    isBrowser ? window.localStorage.getItem(STORAGE_KEYS.seedVersion) : null,
  setSeedVersion: (value: string) => {
    if (!isBrowser) return;
    window.localStorage.setItem(STORAGE_KEYS.seedVersion, value);
  },

  clearAll: () => {
    if (!isBrowser) return;
    window.localStorage.removeItem(STORAGE_KEYS.users);
    window.localStorage.removeItem(STORAGE_KEYS.documents);
    window.localStorage.removeItem(STORAGE_KEYS.transactions);
    window.localStorage.removeItem(STORAGE_KEYS.reviews);
    window.localStorage.removeItem(STORAGE_KEYS.currentUserId);
    window.localStorage.removeItem(STORAGE_KEYS.seedVersion);
  }
};

export const needsSeeding = () => {
  if (!isBrowser) return false;
  const version = storage.getSeedVersion();
  return !version || version !== DEFAULT_SEED_VERSION;
};

