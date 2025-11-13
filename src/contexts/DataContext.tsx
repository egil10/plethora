import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import { APP_NAME } from "../config";
import type {
  Document,
  DocumentLanguage,
  DocumentType,
  PaymentMethod,
  Review,
  Transaction,
  User
} from "../types";
import { calculatePlatformFee, calculateSellerRevenue } from "../utils/fees";
import { applySeedData } from "../utils/seed";
import { storage } from "../utils/storage";

type CreateDocumentInput = {
  title: string;
  description: string;
  priceNOK: number;
  university: string;
  country: Document["country"];
  subject: string;
  courseCode: string;
  type: DocumentType;
  tags: string[];
  language: DocumentLanguage;
  previewUrl: string;
  fileName: string;
};

type UpdateDocumentInput = Partial<Omit<CreateDocumentInput, "priceNOK">> & {
  priceNOK?: number;
};

type CreateTransactionInput = {
  documentId: string;
  buyerId: string;
  paymentMethod: PaymentMethod;
};

type AddReviewInput = {
  documentId: string;
  userId: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
};

type DataContextValue = {
  users: User[];
  documents: Document[];
  transactions: Transaction[];
  reviews: Review[];
  currentUser: User | null;
  setCurrentUserId: (userId: string) => void;
  createDocument: (input: CreateDocumentInput) => Document | null;
  updateDocument: (id: string, input: UpdateDocumentInput) => void;
  createTransaction: (input: CreateTransactionInput) => Transaction | null;
  addReview: (input: AddReviewInput) => void;
  hasPurchasedDocument: (documentId: string, userId?: string) => boolean;
  getSalesCountForDocument: (documentId: string) => number;
  getSellerStats: (sellerId: string) => {
    sales: number;
    documents: number;
    earnings: number;
    rating: number | null;
  };
  simulatePayout: (userId: string) => void;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 11)}`;

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUserId, setCurrentUserIdState] = useState<string | null>(null);

  useEffect(() => {
    applySeedData();
    setUsers(storage.getUsers());
    setDocuments(storage.getDocuments());
    setTransactions(storage.getTransactions());
    setReviews(storage.getReviews());

    const storedUserId = storage.getCurrentUserId();
    if (storedUserId) {
      setCurrentUserIdState(storedUserId);
    } else {
      const fallbackUser = storage.getUsers()[0];
      if (fallbackUser) {
        storage.setCurrentUserId(fallbackUser.id);
        setCurrentUserIdState(fallbackUser.id);
      }
    }
  }, []);

  const persistUsers = useCallback(
    (nextUsers: User[]) => {
      setUsers(nextUsers);
      storage.setUsers(nextUsers);
    },
    [setUsers]
  );

  const persistDocuments = useCallback(
    (nextDocuments: Document[]) => {
      setDocuments(nextDocuments);
      storage.setDocuments(nextDocuments);
    },
    [setDocuments]
  );

  const persistTransactions = useCallback(
    (nextTransactions: Transaction[]) => {
      setTransactions(nextTransactions);
      storage.setTransactions(nextTransactions);
    },
    [setTransactions]
  );

  const persistReviews = useCallback(
    (nextReviews: Review[]) => {
      setReviews(nextReviews);
      storage.setReviews(nextReviews);
    },
    [setReviews]
  );

  const setCurrentUserId = useCallback((userId: string) => {
    storage.setCurrentUserId(userId);
    setCurrentUserIdState(userId);
  }, []);

  const currentUser = useMemo(
    () => users.find((user) => user.id === currentUserId) ?? null,
    [users, currentUserId]
  );

  const hasPurchasedDocument = useCallback(
    (documentId: string, userId?: string) => {
      const buyerId = userId ?? currentUser?.id;
      if (!buyerId) return false;
      return transactions.some(
        (transaction) =>
          transaction.documentId === documentId &&
          transaction.buyerId === buyerId &&
          transaction.status === "completed"
      );
    },
    [transactions, currentUser?.id]
  );

  const getSalesCountForDocument = useCallback(
    (documentId: string) =>
      transactions.filter(
        (transaction) =>
          transaction.documentId === documentId &&
          transaction.status === "completed"
      ).length,
    [transactions]
  );

  const createDocument = useCallback(
    (input: CreateDocumentInput) => {
      if (!currentUser || !["seller", "both"].includes(currentUser.role)) {
        console.warn("Only sellers can create documents in", APP_NAME);
        return null;
      }

      const now = new Date().toISOString();
      const nextDocument: Document = {
        ...input,
        id: createId(),
        sellerId: currentUser.id,
        createdAt: now,
        updatedAt: now,
        ratingAverage: 0,
        ratingCount: 0
      };

      const nextDocuments = [nextDocument, ...documents];
      persistDocuments(nextDocuments);
      return nextDocument;
    },
    [currentUser, documents, persistDocuments]
  );

  const updateDocument = useCallback(
    (documentId: string, input: UpdateDocumentInput) => {
      persistDocuments(
        documents.map((document) =>
          document.id === documentId
            ? {
                ...document,
                ...input,
                updatedAt: new Date().toISOString()
              }
            : document
        )
      );
    },
    [documents, persistDocuments]
  );

  const createTransaction = useCallback(
    ({ documentId, buyerId, paymentMethod }: CreateTransactionInput) => {
      const document = documents.find((item) => item.id === documentId);
      const buyer = users.find((item) => item.id === buyerId);
      if (!document || !buyer) {
        console.warn("Transaction aborted – document or buyer missing");
        return null;
      }

      const platformFeeNOK = calculatePlatformFee(document.priceNOK);
      const sellerRevenueNOK = calculateSellerRevenue(document.priceNOK);

      const transaction: Transaction = {
        id: createId(),
        documentId,
        buyerId,
        sellerId: document.sellerId,
        priceNOK: document.priceNOK,
        platformFeeNOK,
        sellerRevenueNOK,
        createdAt: new Date().toISOString(),
        paymentMethod,
        status: "completed"
      };

      const nextTransactions = [transaction, ...transactions];
      persistTransactions(nextTransactions);

      persistUsers(
        users.map((user) =>
          user.id === document.sellerId
            ? {
                ...user,
                balanceNOK: Math.round((user.balanceNOK + sellerRevenueNOK) * 100) / 100
              }
            : user
        )
      );

      return transaction;
    },
    [documents, persistTransactions, transactions, users, persistUsers]
  );

  const recalculateDocumentRating = useCallback(
    (documentId: string, ratings: Review[]) => {
      if (ratings.length === 0) {
        return { average: 0, count: 0 };
      }
      const total = ratings.reduce((sum, review) => sum + review.rating, 0);
      const average = Math.round((total / ratings.length) * 10) / 10;
      return { average, count: ratings.length };
    },
    []
  );

  const addReview = useCallback(
    (input: AddReviewInput) => {
      if (!hasPurchasedDocument(input.documentId, input.userId)) {
        console.warn("User must purchase document before reviewing");
        return;
      }

      const review: Review = {
        id: createId(),
        documentId: input.documentId,
        userId: input.userId,
        rating: input.rating,
        comment: input.comment,
        createdAt: new Date().toISOString()
      };

      const nextReviews = [review, ...reviews];
      persistReviews(nextReviews);

      const documentReviews = nextReviews.filter(
        (item) => item.documentId === input.documentId
      );
      const { average, count } = recalculateDocumentRating(
        input.documentId,
        documentReviews
      );

      persistDocuments(
        documents.map((document) =>
          document.id === input.documentId
            ? { ...document, ratingAverage: average, ratingCount: count }
            : document
        )
      );
    },
    [
      documents,
      hasPurchasedDocument,
      persistDocuments,
      persistReviews,
      recalculateDocumentRating,
      reviews
    ]
  );

  const getSellerStats = useCallback(
    (sellerId: string) => {
      const sellerDocuments = documents.filter(
        (document) => document.sellerId === sellerId
      );
      const sales = transactions.filter(
        (transaction) =>
          transaction.sellerId === sellerId && transaction.status === "completed"
      );
      const earnings = sales.reduce(
        (sum, transaction) => sum + transaction.sellerRevenueNOK,
        0
      );
      const ratingValues = sellerDocuments
        .filter((document) => document.ratingCount > 0)
        .map((document) => document.ratingAverage);
      const rating =
        ratingValues.length > 0
          ? Math.round(
              (ratingValues.reduce((sum, value) => sum + value, 0) /
                ratingValues.length) *
                10
            ) / 10
          : null;

      return {
        sales: sales.length,
        documents: sellerDocuments.length,
        earnings: Math.round(earnings * 100) / 100,
        rating
      };
    },
    [documents, transactions]
  );

  const value = useMemo<DataContextValue>(
    () => ({
      users,
      documents,
      transactions,
      reviews,
      currentUser,
      setCurrentUserId,
      createDocument,
      updateDocument,
      createTransaction,
      addReview,
      hasPurchasedDocument,
      getSalesCountForDocument,
      getSellerStats,
      simulatePayout: (userId: string) => {
        persistUsers(
          users.map((user) =>
            user.id === userId ? { ...user, balanceNOK: 0 } : user
          )
        );
      }
    }),
    [
      users,
      documents,
      transactions,
      reviews,
      currentUser,
      setCurrentUserId,
      createDocument,
      updateDocument,
      createTransaction,
      addReview,
      hasPurchasedDocument,
      getSalesCountForDocument,
      getSellerStats,
      persistUsers
    ]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

