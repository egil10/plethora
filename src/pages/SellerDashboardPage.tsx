import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { Input, Select, TextArea } from "../components/Input";
import { Tabs } from "../components/Tabs";
import { useData } from "../contexts/DataContext";
import { SUPPORTED_COUNTRIES } from "../config";
import { formatCurrency, formatDate } from "../utils/format";
import type { DocumentType, DocumentLanguage } from "../types";

type DocumentFormState = {
  title: string;
  description: string;
  priceNOK: string;
  university: string;
  country: string;
  subject: string;
  courseCode: string;
  type: DocumentType;
  tags: string;
  language: DocumentLanguage;
  previewUrl: string;
  fileName: string;
};

const initialFormState: DocumentFormState = {
  title: "",
  description: "",
  priceNOK: "49",
  university: "",
  country: "NO",
  subject: "",
  courseCode: "",
  type: "sammendrag",
  tags: "",
  language: "nb",
  previewUrl: "https://files.nordnotes.demo/placeholder.pdf",
  fileName: "notater.pdf"
};

const documentTypes: { value: DocumentType; label: string }[] = [
  { value: "eksamensbesvarelse", label: "Eksamensbesvarelse" },
  { value: "sammendrag", label: "Sammendrag" },
  { value: "forelesningsnotater", label: "Forelesningsnotater" },
  { value: "oppgaveløsning", label: "Oppgaveløsning" },
  { value: "annet", label: "Annet" }
];

const languageOptions: { value: DocumentLanguage; label: string }[] = [
  { value: "nb", label: "Bokmål" },
  { value: "nn", label: "Nynorsk" },
  { value: "en", label: "Engelsk" },
  { value: "sv", label: "Svensk" },
  { value: "da", label: "Dansk" }
];

export const SellerDashboardPage = () => {
  const {
    users,
    currentUser,
    documents,
    transactions,
    createDocument,
    updateDocument,
    getSalesCountForDocument,
    getSellerStats
  } = useData();
  const [activeTab, setActiveTab] = useState("overview");
  const [formState, setFormState] = useState<DocumentFormState>(initialFormState);
  const [editingDocumentId, setEditingDocumentId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const sellerDocuments = useMemo(() => {
    if (!currentUser) return [];
    return documents.filter((document) => document.sellerId === currentUser.id);
  }, [documents, currentUser]);

  const sellerTransactions = useMemo(() => {
    if (!currentUser) return [];
    return transactions.filter((transaction) => transaction.sellerId === currentUser.id);
  }, [transactions, currentUser]);

  const stats = useMemo(
    () => (currentUser ? getSellerStats(currentUser.id) : null),
    [currentUser, getSellerStats]
  );

  if (!currentUser) {
    return (
      <div className="section">
        <div className="container card">
          <h2>Velg en bruker</h2>
          <p>
            For å bruke selgerdashbordet må du først velge en demobruker under Profil. Velg en
            bruker med rollen selger eller både kjøper/selger.
          </p>
          <Link to="/profil">
            <Button>Gå til Profil</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!["seller", "both"].includes(currentUser.role)) {
    return (
      <div className="section">
        <div className="container card">
          <h2>Tilgang for selgere</h2>
          <p>
            Du er logget inn som {currentUser.name} med rollen {currentUser.role}. Endre rollen
            til “selger” eller “begge” for å få tilgang til dashbordet.
          </p>
          <Link to="/profil">
            <Button>Oppdater bruker</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleFormChange = <T extends keyof DocumentFormState>(
    key: T,
    value: DocumentFormState[T]
  ) => {
    setFormState((prev) => ({ ...prev, [key]: value }));
  };

  const handleCreateDocument = () => {
    const priceNumber = Number(formState.priceNOK);
    if (!formState.title.trim() || !formState.description.trim()) {
      alert("Tittel og beskrivelse må fylles ut.");
      return;
    }
    if (!formState.university.trim() || !formState.courseCode.trim()) {
      alert("Universitet og emnekode må fylles ut.");
      return;
    }
    if (Number.isNaN(priceNumber) || priceNumber < 15) {
      alert("Prisen må være minst 15 kr.");
      return;
    }

    const tags = formState.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    const result = createDocument({
      title: formState.title.trim(),
      description: formState.description.trim(),
      priceNOK: priceNumber,
      university: formState.university.trim(),
      country: formState.country as "NO" | "SE" | "DK",
      subject: formState.subject.trim(),
      courseCode: formState.courseCode.trim(),
      type: formState.type,
      tags,
      language: formState.language,
      previewUrl: formState.previewUrl.trim(),
      fileName: formState.fileName.trim()
    });

    if (result) {
      alert("Dokumentet er lagret i demoens localStorage.");
      setFormState(initialFormState);
      setActiveTab("documents");
    }
  };

  const startEditing = (documentId: string, price: number) => {
    setEditingDocumentId(documentId);
    setEditPrice(String(price));
  };

  const handleEditPrice = () => {
    if (!editingDocumentId) return;
    const priceNumber = Number(editPrice);
    if (Number.isNaN(priceNumber) || priceNumber < 15) {
      alert("Prisen må være minst 15 kr.");
      return;
    }
    updateDocument(editingDocumentId, { priceNOK: priceNumber });
    setEditingDocumentId(null);
  };

  return (
    <div className="section">
      <div className="container seller-dashboard">
        <header className="seller-dashboard__header">
          <div>
            <h1>Selgerdashbord</h1>
            <p>Administrer dokumentene dine, se salg og last opp nye notater.</p>
          </div>
          <div className="seller-dashboard__balance card">
            <span>Saldo (demo)</span>
            <strong>{formatCurrency(currentUser.balanceNOK)}</strong>
            <Link to="/profil">
              <Button variant="secondary">Simuler utbetaling</Button>
            </Link>
          </div>
        </header>

        <Tabs
          tabs={[
            { id: "overview", label: "Oversikt" },
            { id: "documents", label: "Mine dokumenter" },
            { id: "new", label: "Nytt dokument" },
            { id: "transactions", label: "Transaksjoner" }
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        {activeTab === "overview" && stats && (
          <div className="seller-dashboard__grid">
            <div className="card seller-stat">
              <span>Total omsetning (demo)</span>
              <strong>{formatCurrency(stats.earnings)}</strong>
            </div>
            <div className="card seller-stat">
              <span>Antall salg</span>
              <strong>{stats.sales}</strong>
            </div>
            <div className="card seller-stat">
              <span>Dokumenter publisert</span>
              <strong>{stats.documents}</strong>
            </div>
            <div className="card seller-stat">
              <span>Gj.snittlig rating</span>
              <strong>{stats.rating ? stats.rating.toFixed(1) : "–"}</strong>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="card seller-documents">
            <h2>Mine dokumenter</h2>
            {sellerDocuments.length === 0 ? (
              <p>Du har ikke publisert dokumenter enda. Gå til “Nytt dokument” for å komme i gang.</p>
            ) : (
              <div className="seller-documents__list">
                {sellerDocuments.map((document) => (
                  <div key={document.id} className="seller-documents__item">
                    <div>
                      <strong>{document.title}</strong>
                      <span>
                        {document.courseCode} • {document.university}
                      </span>
                      <span>
                        {document.ratingCount > 0
                          ? `${document.ratingAverage.toFixed(1)} ⭐ (${document.ratingCount})`
                          : "Ingen vurderinger ennå"}
                      </span>
                      <span>{getSalesCountForDocument(document.id)} salg</span>
                    </div>
                    <div className="seller-documents__actions">
                      {editingDocumentId === document.id ? (
                        <>
                          <Input
                            label="Ny pris (NOK)"
                            value={editPrice}
                            onChange={(event) => setEditPrice(event.target.value)}
                          />
                          <Button onClick={handleEditPrice}>Lagre</Button>
                          <Button variant="ghost" onClick={() => setEditingDocumentId(null)}>
                            Avbryt
                          </Button>
                        </>
                      ) : (
                        <>
                          <span>{formatCurrency(document.priceNOK)}</span>
                          <Button variant="secondary" onClick={() => startEditing(document.id, document.priceNOK)}>
                            Endre pris
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "new" && (
          <div className="card seller-new">
            <h2>Publiser nytt dokument</h2>
            <div className="seller-new__grid">
              <Input
                label="Tittel"
                value={formState.title}
                onChange={(event) => handleFormChange("title", event.target.value)}
              />
              <Input
                label="Pris (NOK)"
                type="number"
                min={15}
                value={formState.priceNOK}
                onChange={(event) => handleFormChange("priceNOK", event.target.value)}
              />
              <Input
                label="Universitet"
                value={formState.university}
                onChange={(event) => handleFormChange("university", event.target.value)}
              />
              <Select
                label="Land"
                value={formState.country}
                onChange={(event) => handleFormChange("country", event.target.value)}
              >
                {SUPPORTED_COUNTRIES.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Emne / fagområde"
                value={formState.subject}
                onChange={(event) => handleFormChange("subject", event.target.value)}
              />
              <Input
                label="Emnekode"
                value={formState.courseCode}
                onChange={(event) => handleFormChange("courseCode", event.target.value)}
              />
              <Select
                label="Type notat"
                value={formState.type}
                onChange={(event) => handleFormChange("type", event.target.value as DocumentType)}
              >
                {documentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </Select>
              <Select
                label="Språk"
                value={formState.language}
                onChange={(event) =>
                  handleFormChange("language", event.target.value as DocumentLanguage)
                }
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              <Input
                label="Nøkkelord / tags (kommaseparert)"
                placeholder="statistikk, eksamen, UiO"
                value={formState.tags}
                onChange={(event) => handleFormChange("tags", event.target.value)}
              />
              <Input
                label="Simulert filnavn"
                value={formState.fileName}
                onChange={(event) => handleFormChange("fileName", event.target.value)}
                helperText="Filen lagres ikke, men navnet vises i UI-et."
              />
              <Input
                label="Forhåndsvisningslenke (demo)"
                value={formState.previewUrl}
                onChange={(event) => handleFormChange("previewUrl", event.target.value)}
                helperText="Placeholder som kan byttes med ekte filopplasting senere."
              />
            </div>
            <TextArea
              label="Beskrivelse"
              value={formState.description}
              onChange={(event) => handleFormChange("description", event.target.value)}
            />
            <Button onClick={handleCreateDocument}>Lagre dokument</Button>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="card seller-transactions">
            <h2>Transaksjoner</h2>
            {sellerTransactions.length === 0 ? (
              <p>Ingen salg enda. Del lenken til dokumentene dine for å få de første kjøpene!</p>
            ) : (
              <div className="seller-transactions__list">
                {sellerTransactions.map((transaction) => {
                  const document = documents.find((item) => item.id === transaction.documentId);
                  const buyer = users.find((user) => user.id === transaction.buyerId);
                  return (
                    <div key={transaction.id} className="seller-transactions__item">
                      <div>
                        <strong>{document?.title ?? "Dokument"}</strong>
                        <span>
                          Kjøpt {formatDate(transaction.createdAt)} av{" "}
                          {buyer?.email ?? transaction.buyerId}
                        </span>
                      </div>
                      <div className="seller-transactions__amounts">
                        <span>Pris: {formatCurrency(transaction.priceNOK)}</span>
                        <span>Gebyr: {formatCurrency(transaction.platformFeeNOK)}</span>
                        <span>Din del: {formatCurrency(transaction.sellerRevenueNOK)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

