import { Link } from "react-router-dom";
import type { Document } from "../types";
import { formatCurrency, sentenceCase } from "../utils/format";
import { Tag } from "./Tag";
import { RatingStars } from "./RatingStars";
import { useData } from "../contexts/DataContext";

type DocumentCardProps = {
  document: Document;
};

const countryBadge: Record<string, string> = {
  NO: "🇳🇴",
  SE: "🇸🇪",
  DK: "🇩🇰"
};

export const DocumentCard = ({ document }: DocumentCardProps) => {
  const { getSalesCountForDocument } = useData();
  const sales = getSalesCountForDocument(document.id);

  return (
    <Link to={`/dokument/${document.id}`} className="card document-card">
      <div className="document-card__header">
        <Tag label={sentenceCase(document.type)} tone="accent" />
        <span className="document-card__price">{formatCurrency(document.priceNOK)}</span>
      </div>
      <h3>{document.title}</h3>
      <p className="document-card__meta">
        {document.courseCode} • {document.university}
      </p>
      <div className="document-card__tags">
        <Tag label={document.subject} />
        <Tag label={countryBadge[document.country] ?? document.country} tone="muted" />
        <Tag label={`${sales} salg`} tone="muted" />
      </div>
      <div className="document-card__footer">
        {document.ratingCount > 0 ? (
          <RatingStars value={document.ratingAverage} count={document.ratingCount} />
        ) : (
          <span className="document-card__no-rating">Ingen vurderinger ennå</span>
        )}
      </div>
    </Link>
  );
};

