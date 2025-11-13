type RatingStarsProps = {
  value: number;
  count?: number;
};

export const RatingStars = ({ value, count }: RatingStarsProps) => {
  const rounded = Math.round(value * 2) / 2;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
      <span aria-hidden="true">
        {[1, 2, 3, 4, 5].map((index) => (
          <span key={index} style={{ color: index <= rounded ? "#f5b400" : "#d7dee9" }}>
            ★
          </span>
        ))}
      </span>
      <span style={{ fontSize: "0.85rem", color: "var(--color-muted)" }}>
        {value.toFixed(1)}
        {typeof count === "number" && ` (${count})`}
      </span>
    </div>
  );
};

