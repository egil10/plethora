import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/Button";
import { DocumentCard } from "../components/DocumentCard";
import { Modal } from "../components/Modal";
import { RatingStars } from "../components/RatingStars";
import { Select, TextArea } from "../components/Input";
import { Tag } from "../components/Tag";
import { UserBadge } from "../components/UserBadge";
import { useData } from "../contexts/DataContext";
import { calculatePlatformFee, calculateSellerRevenue } from "../utils/fees";
import { formatCurrency, formatDate, sentenceCase } from "../utils/format";
import type { PaymentMethod } from "../types";

const paymentOptions: { value: PaymentMethod; label: string }[] = [
  { value: "vipps_demo", label: "Vipps (demo)" },
  { value: "kort_demo", label: "Kortbetaling (demo)" },
  { value: "stripe_demo", label: "Stripe Checkout (demo)" }
];

export const DocumentDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    documents,
    users,
    reviews,
    currentUser,
    createTransaction,
    hasPurchasedDocument,
    addReview,
    getSalesCountForDocument,
    getSellerStats
  } = useData();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("vipps_demo");
  const [checkoutState, setCheckoutState] = useState<"idle" | "success">("idle");
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState("");

  const document = documents.find((item) => item.id === id);

  const seller = useMemo(
    () => (document ? users.find((user) => user.id === document.sellerId) ?? null : null),
    [document, users]
  );

  const documentReviews = useMemo(
    () => reviews.filter((review) => review.documentId === document?.id),
    [reviews, document?.id]
  );

  const relatedDocuments = useMemo(() => {
    if (!document) return [];
    return documents
      .filter(
        (item) =>
          item.id !== document.id &&
          (item.subject === document.subject || item.courseCode === document.courseCode)
      )
      .slice(0, 3);
  }, [documents, document]);

  if (!document || !seller) {
    return (
      <div className="section">
        <div className="container">
          <div className="card">
            <h2>Dokumentet finnes ikke</h2>
            <p>Vi klarte ikke å finne dokumentet. Kanskje er det solgt ut eller slettet.</p>
            <Button onClick={() => navigate("/dokumenter")}>Til dokumentoversikten</Button>
          </div>
        </div>
      </div>
    );
  }

  const hasPurchased = hasPurchasedDocument(document.id);
  const hasReviewed = !!documentReviews.find(
    (review) => review.userId === currentUser?.id
  );
  const sellerStats = getSellerStats(document.sellerId);
  const platformFee = calculatePlatformFee(document.priceNOK);
  const sellerRevenue = calculateSellerRevenue(document.priceNOK);
  const salesCount = getSalesCountForDocument(document.id);

  const handleCheckout = () => {
    if (!currentUser) {
      alert("Velg en bruker under Profil før du kjøper dokumenter.");
      return;
    }
    if (currentUser.id === document.sellerId) {
      alert("Du kan ikke kjøpe ditt eget dokument i demoen.");
      return;
    }

    const transaction = createTransaction({
      documentId: document.id,
      buyerId: currentUser.id,
      paymentMethod
    });
    if (transaction) {
      setCheckoutState("success");
    }
  };

  const handleAddReview = () => {
    if (!currentUser) return;
    if (!reviewComment.trim()) {
      alert("Skriv en kort kommentar om dokumentet.");
      return;
    }
    addReview({
      documentId: document.id,
      userId: currentUser.id,
      rating: reviewRating as 1 | 2 | 3 | 4 | 5,
      comment: reviewComment.trim()
    });
    setReviewComment("");
    setReviewRating(5);
  };

  return (
    <div className="section">
      <div className="container document-detail">
        <div className="document-detail__main card">
          <div className="document-detail__header">
            <Tag label={sentenceCase(document.type)} tone="accent" />
            <span className="document-detail__price">
              Pris: {formatCurrency(document.priceNOK)}
            </span>
          </div>
          <h1>{document.title}</h1>
          <p className="document-detail__meta">
            {document.courseCode} • {document.university} • {document.subject}
          </p>
          <p className="document-detail__description">{document.description}</p>

          <div className="document-detail__pricebox">
            <div>
              <strong>
                Kjøp for {formatCurrency(document.priceNOK)} – du får full tilgang til PDF-en.
              </strong>
              <p>
                Selgeren får {formatCurrency(sellerRevenue)} (90 %). NordNotes tar{" "}
                {formatCurrency(platformFee)} (10 % plattformgebyr).
              </p>
              <p>
                Betalingen er simulert i denne MVP-en. Når ekte integrasjon kobles på, er
                Vipps/Stripe klar i koden.
              </p>
            </div>
            {hasPurchased ? (
              <div className="document-detail__download">
                <Button size="lg">Last ned (demo)</Button>
                <span>Du har kjøpt dette dokumentet i demoen.</span>
              </div>
            ) : (
              <Button size="lg" onClick={() => setIsCheckoutOpen(true)}>
                Kjøp nå (demo)
              </Button>
            )}
          </div>

          <div className="document-detail__info card">
            <h3>PDF-visning</h3>
            <div className="document-detail__preview">
              <p>
                PDF-visning kommer i neste versjon. I denne MVP-en viser vi en simulert forhåndsvisning.
              </p>
              <span className="document-detail__preview-file">{document.fileName}</span>
              <span className="document-detail__preview-placeholder">
                📄 Forhåndsvisning er deaktivert i demoen.
              </span>
            </div>
            <div className="document-detail__tags">
              {document.tags.map((tag) => (
                <Tag key={tag} label={tag} />
              ))}
            </div>
            <span className="document-detail__meta">
              Sist oppdatert {formatDate(document.updatedAt)} • Språk:{" "}
              {document.language.toUpperCase()}
            </span>
          </div>

          <div className="document-detail__section">
            <h3>Vurderinger</h3>
            {documentReviews.length === 0 ? (
              <p>Ingen vurderinger ennå.</p>
            ) : (
              <div className="document-detail__reviews">
                {documentReviews.map((review) => {
                  const reviewer = users.find((user) => user.id === review.userId);
                  return (
                    <div key={review.id} className="card document-detail__review">
                      <div className="document-detail__review-header">
                        <strong>{reviewer?.name ?? "Student"}</strong>
                        <RatingStars value={review.rating} />
                      </div>
                      <p>{review.comment}</p>
                      <span>{formatDate(review.createdAt)}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {hasPurchased && currentUser && !hasReviewed && (
              <div className="card document-detail__review-form">
                <h4>Legg igjen en vurdering</h4>
                <Select
                  label="Vurdering"
                  value={String(reviewRating)}
                  onChange={(event) => setReviewRating(Number(event.target.value))}
                >
                  {[5, 4, 3, 2, 1].map((value) => (
                    <option key={value} value={value}>
                      {value} stjerner
                    </option>
                  ))}
                </Select>
                <TextArea
                  label="Kommentar"
                  placeholder="Hva likte du best?"
                  value={reviewComment}
                  onChange={(event) => setReviewComment(event.target.value)}
                />
                <Button onClick={handleAddReview}>Send vurdering</Button>
              </div>
            )}
          </div>
        </div>

        <aside className="document-detail__sidebar">
          <div className="card">
            <h3>Selger</h3>
            <UserBadge
              name={seller.name}
              university={seller.university}
              joinedAt={seller.joinedAt}
              country={seller.country}
              rating={sellerStats.rating}
            />
            <div className="document-detail__seller-stats">
              <div>
                <strong>{sellerStats.documents}</strong>
                <span>Dokumenter</span>
              </div>
              <div>
                <strong>{sellerStats.sales}</strong>
                <span>Salg</span>
              </div>
              <div>
                <strong>{formatCurrency(seller.balanceNOK)}</strong>
                <span>Balanse (demo)</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3>Statistikk</h3>
            <ul className="document-detail__stats">
              <li>
                <span>Antall salg</span>
                <strong>{salesCount}</strong>
              </li>
              <li>
                <span>Gj.snittlig vurdering</span>
                <strong>
                  {document.ratingCount > 0 ? document.ratingAverage.toFixed(1) : "–"}
                </strong>
              </li>
              <li>
                <span>Type</span>
                <strong>{sentenceCase(document.type)}</strong>
              </li>
              <li>
                <span>Land</span>
                <strong>{document.country}</strong>
              </li>
            </ul>
          </div>

          {relatedDocuments.length > 0 && (
            <div className="card">
              <h3>Relaterte dokumenter</h3>
              <div className="document-detail__related">
                {relatedDocuments.map((item) => (
                  <DocumentCard key={item.id} document={item} />
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      <Modal
        title="Simulert checkout"
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setCheckoutState("idle");
        }}
        footer={
          checkoutState === "success" ? (
            <Button onClick={() => setIsCheckoutOpen(false)}>Lukk</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => setIsCheckoutOpen(false)}>
                Avbryt
              </Button>
              <Button onClick={handleCheckout}>Fullfør kjøp (demo)</Button>
            </>
          )
        }
      >
        {checkoutState === "success" ? (
          <div className="checkout-success">
            <h3>Kjøp gjennomført (demo)</h3>
            <p>
              I en ekte versjon ville du fått kvittering på e-post og umiddelbar tilgang til
              dokumentet. I demoen er kjøpet registrert i localStorage.
            </p>
          </div>
        ) : (
          <div className="checkout-body">
            <p>
              Du kjøper <strong>{document.title}</strong> fra {seller.name}.
            </p>
            <ul>
              <li>Pris: {formatCurrency(document.priceNOK)}</li>
              <li>Plattformgebyr (10 %): {formatCurrency(platformFee)}</li>
              <li>Selger får: {formatCurrency(sellerRevenue)}</li>
            </ul>
            <Select
              label="Velg betalingsmetode (simulert)"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value as PaymentMethod)}
            >
              {paymentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        )}
      </Modal>
    </div>
  );
};

