import type { ButtonHTMLAttributes } from "react";
import { cn } from "../utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
};

export const Button = ({
  children,
  className,
  variant = "primary",
  size = "md",
  block = false,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      "button",
      variant,
      size,
      block && "block",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

