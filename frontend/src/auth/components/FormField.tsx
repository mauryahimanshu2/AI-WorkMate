import type { InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function FormField({ label, error, id, ...inputProps }: FormFieldProps) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={error ? 'form-field__input--error' : undefined}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
        {...inputProps}
      />
      {error && <span className="form-field__error" id={errorId}>{error}</span>}
    </div>
  );
}
