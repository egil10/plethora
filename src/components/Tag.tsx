import { cn } from "../utils/cn";

type TagProps = {
  label: string;
  tone?: "default" | "accent" | "muted";
  className?: string;
};

export const Tag = ({ label, tone = "default", className }: TagProps) => (
  <span className={cn("tag", tone, className)}>{label}</span>
);

