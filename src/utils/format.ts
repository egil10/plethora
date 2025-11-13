export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("nb-NO", {
    style: "currency",
    currency: "NOK",
    maximumFractionDigits: 2
  }).format(value);

export const formatDate = (value: string | number | Date) =>
  new Intl.DateTimeFormat("nb-NO", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(typeof value === "string" ? new Date(value) : value);

export const sentenceCase = (value: string) =>
  value.charAt(0).toUpperCase() + value.slice(1);

