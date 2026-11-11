import { useEffect, useState, type FormEvent } from 'react';

import { AuthLayout } from '../components/AuthLayout';
import { FormAlert } from '../components/FormAlert';
import { FormField } from '../components/FormField';
import { PasswordField } from '../components/PasswordField';
import { saveSession, signIn } from '../services/authApi';

interface SignInErrors {
  email?: string;
  password?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignInPage() {
  const [email, setEmail] = useState(() => sessionStorage.getItem('signupEmail') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState<SignInErrors>({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState(
    () => sessionStorage.getItem('authNotice') || '',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    sessionStorage.removeItem('signupEmail');
    sessionStorage.removeItem('authNotice');
  }, []);

  const validate = (): boolean => {
    const nextErrors: SignInErrors = {};

    if (!EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.';
    }
    if (!password) {
      nextErrors.password = 'Enter your password.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError('');
    setSuccessMessage('');

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const session = await signIn({ email: email.trim(), password });
      saveSession(session, rememberMe);
      setSuccessMessage(`Welcome back, ${session.user.name}. Redirecting…`);
      const destination = session.user.role === 'admin' ? '/admin' : '/dashboard';
      window.setTimeout(() => window.location.assign(destination), 700);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Unable to sign in.');
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in to your workspace"
      description="Continue creating, refining, and organizing your content."
      alternateText="New to AI WorkMate?"
      alternateLabel="Create an account"
      alternateHref="/signup"
    >
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        {serverError && <FormAlert type="error" message={serverError} />}
        {successMessage && <FormAlert type="success" message={successMessage} />}

        <FormField
          id="signin-email"
          label="Email address"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          placeholder="you@example.com"
          error={errors.email}
          disabled={isSubmitting}
        />
        <PasswordField
          id="signin-password"
          label="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          placeholder="Enter your password"
          error={errors.password}
          disabled={isSubmitting}
        />

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            disabled={isSubmitting}
          />
          <span>Keep me signed in on this device</span>
        </label>

        <button className="auth-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <span className="button-spinner" aria-hidden="true" /> : 'Sign in'}
          {!isSubmitting && <span aria-hidden="true">→</span>}
        </button>
      </form>
    </AuthLayout>
  );
}
