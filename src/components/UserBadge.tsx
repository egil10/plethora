import { formatDate } from "../utils/format";
import { RatingStars } from "./RatingStars";

type UserBadgeProps = {
  name: string;
  university: string;
  joinedAt: string;
  country: string;
  rating?: number | null;
};

const countryLabels: Record<string, string> = {
  NO: "🇳🇴",
  SE: "🇸🇪",
  DK: "🇩🇰"
};

export const UserBadge = ({
  name,
  university,
  joinedAt,
  country,
  rating
}: UserBadgeProps) => (
  <div
    style={{
      display: "flex",
      gap: "1rem",
      alignItems: "center",
      background: "rgba(11, 61, 96, 0.05)",
      borderRadius: "16px",
      padding: "1rem 1.2rem"
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        background: "var(--color-primary)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "1.1rem"
      }}
    >
      {name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
      <span style={{ fontWeight: 600, fontSize: "1rem" }}>
        {name} {countryLabels[country] ?? ""}
      </span>
      <span style={{ fontSize: "0.9rem", color: "var(--color-muted)" }}>
        {university} • Med siden {formatDate(joinedAt)}
      </span>
      {typeof rating === "number" && rating > 0 && (
        <RatingStars value={rating} />
      )}
    </div>
  </div>
);

