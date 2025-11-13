import type {
  InputHTMLAttributes,
  TextareaHTMLAttributes,
  SelectHTMLAttributes
} from "react";
import { cn } from "../utils/cn";

type BaseFieldProps = {
  label: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
};

type InputProps = InputHTMLAttributes<HTMLInputElement> & BaseFieldProps;

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & BaseFieldProps;

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & BaseFieldProps;

const FieldWrapper = ({
  label,
  helperText,
  error,
  fullWidth,
  children
}: BaseFieldProps & { children: React.ReactNode }) => (
  <label className={cn("field", fullWidth && "block")}>
    <span className="field-label">
      {label}
      {error && <span className="field-error"> – {error}</span>}
    </span>
    {children}
    {helperText && <span className="field-helper">{helperText}</span>}
  </label>
);

export const Input = ({ className, fullWidth, ...props }: InputProps) => {
  const { label, helperText, error, ...rest } = props;
  return (
    <FieldWrapper
      label={label}
      helperText={helperText}
      error={error}
      fullWidth={fullWidth}
    >
      <input className={cn("field-input", className)} {...rest} />
    </FieldWrapper>
  );
};

export const TextArea = ({ className, ...props }: TextAreaProps) => {
  const { label, helperText, error, fullWidth, ...rest } = props;
  return (
    <FieldWrapper
      label={label}
      helperText={helperText}
      error={error}
      fullWidth={fullWidth}
    >
      <textarea className={cn("field-input", "textarea", className)} {...rest} />
    </FieldWrapper>
  );
};

export const Select = ({ className, children, ...props }: SelectProps) => {
  const { label, helperText, error, fullWidth, ...rest } = props;
  return (
    <FieldWrapper
      label={label}
      helperText={helperText}
      error={error}
      fullWidth={fullWidth}
    >
      <select className={cn("field-input", className)} {...rest}>
        {children}
      </select>
    </FieldWrapper>
  );
};

