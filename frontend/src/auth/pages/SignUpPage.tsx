import { useState, type FormEvent } from 'react';

import { AuthLayout } from '../components/AuthLayout';
import { FormAlert } from '../components/FormAlert';
import { FormField } from '../components/FormField';
import { PasswordField } from '../components/PasswordField';
import { signUp } from '../services/authApi';

interface SignUpErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const nextErrors: SignUpErrors = {};
    const trimmedName = name.trim();

    if (trimmedName.length < 2 || trimmedName.length > 100) {
      nextErrors.name = 'Name must contain between 2 and 100 characters.';
    }
    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (password.length < 8) {
      nextErrors.password = 'Password must contain at least 8 characters.';
    }
    if (confirmPassword !== password) {
      nextErrors.confirmPassword = 'Passwords do not match.';
    }
    if (!acceptedTerms) {
      nextErrors.terms = 'Please accept the terms to continue.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await signUp({ name: name.trim(), email: email.trim(), password });
      sessionStorage.setItem('signupEmail', email.trim());
      sessionStorage.setItem('authNotice', 'Account created successfully. You can sign in now.');
      window.location.assign('/signin');
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Unable to create your account.');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Start creating"
      title="Create your AI WorkMate account"
      description="Set up your workspace and turn your next idea into useful content."
      alternateText="Already have an account?"
      alternateLabel="Sign in"
      alternateHref="/signin"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {serverError && <FormAlert type="error" message={serverError} />}

        <FormField
          id="signup-name"
          label="Full name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoComplete="name"
          placeholder="Your full name"
          error={errors.name}
          disabled={isSubmitting}
        />
        <FormField
          id="signup-email"
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email}
          disabled={isSubmitting}
        />
        <div className="form-row">
          <PasswordField
            id="signup-password"
            label="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            placeholder="At least 8 characters"
            error={errors.password}
            disabled={isSubmitting}
          />
          <PasswordField
            id="signup-confirm-password"
            label="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            placeholder="Repeat your password"
            error={errors.confirmPassword}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              disabled={isSubmitting}
            />
            <span>I agree to the terms of use and privacy policy.</span>
          </label>
          {errors.terms && <span className="form-field__error">{errors.terms}</span>}
        </div>

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <span className="button-spinner" aria-hidden="true" /> : 'Create account'}
          {!isSubmitting && <span aria-hidden="true">→</span>}
        </button>
      </form>
    </AuthLayout>
  );
}
