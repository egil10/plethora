import { DEFAULT_SEED_VERSION } from "../config";
import type { Document, Review, Transaction, User } from "../types";
import { needsSeeding, storage } from "./storage";

const users: User[] = [
  {
    id: "user-elin",
    name: "Elin Haug",
    email: "elin.haug@nordnotes.demo",
    role: "seller",
    university: "Universitetet i Oslo (UiO)",
    country: "NO",
    balanceNOK: 88.2,
    joinedAt: "2023-09-01T10:00:00.000Z"
  },
  {
    id: "user-mathias",
    name: "Mathias Lund",
    email: "mathias.lund@nordnotes.demo",
    role: "both",
    university: "Norges Handelshøyskole (NHH)",
    country: "NO",
    balanceNOK: 58.5,
    joinedAt: "2024-01-12T08:30:00.000Z"
  },
  {
    id: "user-sofia",
    name: "Sofia Berg",
    email: "sofia.berg@nordnotes.demo",
    role: "buyer",
    university: "Stockholms universitet",
    country: "SE",
    balanceNOK: 0,
    joinedAt: "2024-03-22T15:45:00.000Z"
  },
  {
    id: "user-hanna",
    name: "Hanna Korhonen",
    email: "hanna.korhonen@nordnotes.demo",
    role: "seller",
    university: "Københavns Universitet",
    country: "DK",
    balanceNOK: 71.1,
    joinedAt: "2023-11-05T12:20:00.000Z"
  }
];

const documents: Document[] = [
  {
    id: "doc-statistikk",
    title: "Statistikk: komplette eksamensnotater STK1110",
    description:
      "Komplette eksamensbesvarelser, formler og typiske oppgaver fra STK1110. Perfekt for repetisjon før eksamen.",
    priceNOK: 49,
    sellerId: "user-elin",
    university: "Universitetet i Oslo (UiO)",
    country: "NO",
    subject: "Statistikk",
    courseCode: "STK1110",
    type: "eksamensbesvarelse",
    ratingAverage: 4.5,
    ratingCount: 2,
    createdAt: "2024-04-15T09:00:00.000Z",
    updatedAt: "2024-08-01T09:00:00.000Z",
    previewUrl: "https://files.nordnotes.demo/statistikk-stk1110.pdf",
    fileName: "STK1110-eksamensnotater.pdf",
    tags: ["statistikk", "sannsynlighet", "UiO", "eksamen"],
    language: "nb"
  },
  {
    id: "doc-makro",
    title: "Makroøkonomi sammendrag ECON2010",
    description:
      "Kortfattet sammendrag med modeller, grafer og nøkkelbegreper fra ECON2010. Fokus på forståelse og repetisjon.",
    priceNOK: 59,
    sellerId: "user-elin",
    university: "Universitetet i Oslo (UiO)",
    country: "NO",
    subject: "Økonomi",
    courseCode: "ECON2010",
    type: "sammendrag",
    ratingAverage: 4,
    ratingCount: 1,
    createdAt: "2024-02-20T11:30:00.000Z",
    updatedAt: "2024-07-18T11:30:00.000Z",
    previewUrl: "https://files.nordnotes.demo/makroøkonomi-econ2010.pdf",
    fileName: "ECON2010-makrookonomi.pdf",
    tags: ["økonomi", "makro", "UiO"],
    language: "nb"
  },
  {
    id: "doc-finans",
    title: "Finans: forelesningsnotater FIN3001",
    description:
      "Detaljerte forelesningsnotater med caser, illustrasjoner og løste oppgaver for FIN3001 ved NHH.",
    priceNOK: 65,
    sellerId: "user-mathias",
    university: "Norges Handelshøyskole (NHH)",
    country: "NO",
    subject: "Finans",
    courseCode: "FIN3001",
    type: "forelesningsnotater",
    ratingAverage: 5,
    ratingCount: 1,
    createdAt: "2024-05-05T13:15:00.000Z",
    updatedAt: "2024-09-02T13:15:00.000Z",
    previewUrl: "https://files.nordnotes.demo/finans-fin3001.pdf",
    fileName: "FIN3001-forelesningsnotater.pdf",
    tags: ["finans", "nhh", "strategi"],
    language: "nb"
  },
  {
    id: "doc-jus",
    title: "Juridisk metode og oppgaveløsning JUS1010",
    description:
      "Oppgaveløsninger og juridisk metode forklart steg for steg. Strukturert etter eksamensmalen ved KU.",
    priceNOK: 79,
    sellerId: "user-hanna",
    university: "Københavns Universitet",
    country: "DK",
    subject: "Jus",
    courseCode: "JUS1010",
    type: "oppgaveløsning",
    ratingAverage: 4,
    ratingCount: 1,
    createdAt: "2023-12-01T10:45:00.000Z",
    updatedAt: "2024-06-15T10:45:00.000Z",
    previewUrl: "https://files.nordnotes.demo/jus1010.pdf",
    fileName: "JUS1010-oppgaver.pdf",
    tags: ["jus", "KU", "case", "metode"],
    language: "da"
  },
  {
    id: "doc-psyk",
    title: "Psykologi sammendrag PSY1501",
    description:
      "Visuelle sammendrag og hukommelsesteknikker for PSY1501. Fokus på læringspsykologi og kognisjon.",
    priceNOK: 55,
    sellerId: "user-hanna",
    university: "Københavns Universitet",
    country: "DK",
    subject: "Psykologi",
    courseCode: "PSY1501",
    type: "sammendrag",
    ratingAverage: 0,
    ratingCount: 0,
    createdAt: "2024-03-28T16:00:00.000Z",
    updatedAt: "2024-03-28T16:00:00.000Z",
    previewUrl: "https://files.nordnotes.demo/psyk1501.pdf",
    fileName: "PSY1501-sammendrag.pdf",
    tags: ["psykologi", "hukommelse", "skjema"],
    language: "nb"
  },
  {
    id: "doc-datasci",
    title: "Datascience notater DATS2300 NTNU",
    description:
      "Sammendrag av algoritmeanalyse, Python-snippets og eksamenstips fra DATS2300 ved NTNU.",
    priceNOK: 69,
    sellerId: "user-mathias",
    university: "NTNU",
    country: "NO",
    subject: "Informatikk",
    courseCode: "DATS2300",
    type: "sammendrag",
    ratingAverage: 0,
    ratingCount: 0,
    createdAt: "2024-06-10T09:40:00.000Z",
    updatedAt: "2024-09-10T09:40:00.000Z",
    previewUrl: "https://files.nordnotes.demo/dats2300.pdf",
    fileName: "DATS2300-notater.pdf",
    tags: ["datascience", "algoritmer", "ntnu"],
    language: "nb"
  }
];

const transactions: Transaction[] = [
  {
    id: "txn-1001",
    documentId: "doc-statistikk",
    buyerId: "user-mathias",
    sellerId: "user-elin",
    priceNOK: 49,
    platformFeeNOK: 4.9,
    sellerRevenueNOK: 44.1,
    createdAt: "2024-08-12T14:00:00.000Z",
    paymentMethod: "vipps_demo",
    status: "completed"
  },
  {
    id: "txn-1002",
    documentId: "doc-statistikk",
    buyerId: "user-sofia",
    sellerId: "user-elin",
    priceNOK: 49,
    platformFeeNOK: 4.9,
    sellerRevenueNOK: 44.1,
    createdAt: "2024-09-01T19:20:00.000Z",
    paymentMethod: "kort_demo",
    status: "completed"
  },
  {
    id: "txn-1003",
    documentId: "doc-finans",
    buyerId: "user-sofia",
    sellerId: "user-mathias",
    priceNOK: 65,
    platformFeeNOK: 6.5,
    sellerRevenueNOK: 58.5,
    createdAt: "2024-10-05T09:30:00.000Z",
    paymentMethod: "stripe_demo",
    status: "completed"
  },
  {
    id: "txn-1004",
    documentId: "doc-jus",
    buyerId: "user-mathias",
    sellerId: "user-hanna",
    priceNOK: 79,
    platformFeeNOK: 7.9,
    sellerRevenueNOK: 71.1,
    createdAt: "2024-07-18T17:45:00.000Z",
    paymentMethod: "vipps_demo",
    status: "completed"
  }
];

const reviews: Review[] = [
  {
    id: "rev-2001",
    documentId: "doc-statistikk",
    userId: "user-mathias",
    rating: 5,
    comment: "Perfekt oversikt! Sparte meg masse tid i eksamensuka.",
    createdAt: "2024-08-13T08:00:00.000Z"
  },
  {
    id: "rev-2002",
    documentId: "doc-statistikk",
    userId: "user-sofia",
    rating: 4,
    comment: "God kvalitet og lett å forstå, men savnet noen eksempler.",
    createdAt: "2024-09-02T07:10:00.000Z"
  },
  {
    id: "rev-2003",
    documentId: "doc-finans",
    userId: "user-sofia",
    rating: 5,
    comment: "Elsker casene! Føles som forelesningene – bare mer konsise.",
    createdAt: "2024-10-06T12:30:00.000Z"
  },
  {
    id: "rev-2004",
    documentId: "doc-jus",
    userId: "user-mathias",
    rating: 4,
    comment: "Strukturerte notater som gjorde metodeoppgavene mye enklere.",
    createdAt: "2024-07-20T11:10:00.000Z"
  }
];

export const applySeedData = () => {
  if (!needsSeeding()) return;

  storage.setUsers(users);
  storage.setDocuments(documents);
  storage.setTransactions(transactions);
  storage.setReviews(reviews);
  storage.setCurrentUserId("user-mathias");
  storage.setSeedVersion(DEFAULT_SEED_VERSION);
};

