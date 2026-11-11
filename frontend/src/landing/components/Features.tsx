import { SectionHeading } from './SectionHeading';

const features = [
  { icon: '✦', title: 'Thoughtful improvements', description: 'Rewrite, shorten, expand, clarify, translate, and change tone without replacing your original.' },
  { icon: '◫', title: 'Version history', description: 'Return to earlier drafts, compare changes, and keep a clear trail of every revision.' },
  { icon: '◌', title: 'Your voice, configured', description: 'Set the audience, language, tone, keywords, and length for more relevant first drafts.' },
  { icon: '↙', title: 'Ready to share', description: 'Copy your content or export it as clean text and Markdown when the draft is ready.' },
  { icon: '⌁', title: 'Usage at a glance', description: 'See generation activity, token usage, response times, and estimated AI costs.' },
  { icon: '⌾', title: 'Private by design', description: 'Authenticated access and record ownership keep every user’s content properly separated.' },
];

export function Features() {
  return (
    <section className="section features" id="features">
      <div className="container features__layout">
        <SectionHeading
          eyebrow="More than a first draft"
          title="A calm, capable space for better writing"
          description="The useful tools stay close, while the complexity stays out of your way."
          align="left"
        />
        <div className="features__grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-card__icon" aria-hidden="true">{feature.icon}</span>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
