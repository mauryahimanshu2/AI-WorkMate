import { StudioPreview } from './StudioPreview';

const highlights = ['10 content formats', '9 writing tones', '7+ languages'];

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__glow hero__glow--one" />
      <div className="hero__glow hero__glow--two" />
      <div className="container hero__grid">
        <div className="hero__content">
          <p className="eyebrow">
            <span className="eyebrow__dot" />
            Your creative workday, simplified
          </p>
          <h1>
            Turn clear ideas into
            <span className="hero__accent"> remarkable content.</span>
          </h1>
          <p className="hero__description">
            AI WorkMate helps you draft, refine, and organize professional content
            without losing your voice. From the first prompt to the final polish.
          </p>
          <div className="hero__actions">
            <a className="button" href="#content-types">
              Explore the studio
              <span aria-hidden="true">→</span>
            </a>
            <a className="text-link" href="#how-it-works">
              See how it works
              <span aria-hidden="true">↓</span>
            </a>
          </div>
          <ul className="hero__highlights" aria-label="Product highlights">
            {highlights.map((highlight) => (
              <li key={highlight}>
                <span aria-hidden="true">✓</span>
                {highlight}
              </li>
            ))}
          </ul>
        </div>
        <StudioPreview />
      </div>
    </section>
  );
}
