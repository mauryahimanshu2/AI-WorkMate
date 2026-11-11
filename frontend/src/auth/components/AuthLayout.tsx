import type { ReactNode } from 'react';

import { Brand } from '../../landing/components/Brand';

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  alternateText: string;
  alternateLabel: string;
  alternateHref: string;
  children: ReactNode;
}

export function AuthLayout({
  eyebrow,
  title,
  description,
  alternateText,
  alternateLabel,
  alternateHref,
  children,
}: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <div className="auth-page__glow auth-page__glow--one" />
      <div className="auth-page__glow auth-page__glow--two" />

      <section className="auth-form-card" aria-labelledby="auth-title">
        <div className="auth-form-card__brand">
          <Brand />
        </div>
        <div className="auth-form-card__heading">
          <p>{eyebrow}</p>
          <h1 id="auth-title">{title}</h1>
          <span>{description}</span>
        </div>
        {children}
        <p className="auth-switch">
          {alternateText}{' '}
          <a href={alternateHref}>{alternateLabel}</a>
        </p>
      </section>
    </main>
  );
}
