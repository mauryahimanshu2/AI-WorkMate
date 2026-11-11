import { useState, type InputHTMLAttributes } from 'react';

interface PasswordFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  error?: string;
}

export function PasswordField({ label, error, id, ...inputProps }: PasswordFieldProps) {
  const [isVisible, setIsVisible] = useState(false);
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      <div className="password-input">
        <input
          id={id}
          type={isVisible ? 'text' : 'password'}
          className={error ? 'form-field__input--error' : undefined}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setIsVisible((visible) => !visible)}
          aria-label={isVisible ? 'Hide password' : 'Show password'}
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
      {error && <span className="form-field__error" id={errorId}>{error}</span>}
    </div>
  );
}
