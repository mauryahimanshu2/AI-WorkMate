import { useState } from 'react';

import { SectionHeading } from './SectionHeading';

const contentTypes = [
  { icon: '✉', name: 'Professional Email', example: 'Clear messages that sound confident, thoughtful, and human.', color: 'coral' },
  { icon: '#', name: 'Social Media Post', example: 'Platform-aware posts with the right energy and a natural CTA.', color: 'violet' },
  { icon: '▤', name: 'Blog Article', example: 'Well-structured drafts with useful headings and a coherent flow.', color: 'gold' },
  { icon: '⌁', name: 'Blog Outline', example: 'Turn a rough topic into a practical, detailed writing plan.', color: 'mint' },
  { icon: '◇', name: 'Product Description', example: 'Benefit-led copy that connects features to customer needs.', color: 'blue' },
  { icon: '↗', name: 'Marketing Copy', example: 'Focused promotional messaging shaped around your audience.', color: 'pink' },
  { icon: '▣', name: 'Business Proposal', example: 'Organized proposals with objectives, approach, and next steps.', color: 'teal' },
  { icon: '◉', name: 'Job Description', example: 'Role summaries, responsibilities, and clear requirements.', color: 'orange' },
  { icon: '✓', name: 'Meeting Summary', example: 'Key decisions, discussion points, and action items in one place.', color: 'green' },
  { icon: '+', name: 'Custom Content', example: 'Your instructions, your format, and a draft shaped around both.', color: 'ink' },
];

export function ContentTypes() {
  const [activeType, setActiveType] = useState(0);
  const selectedType = contentTypes[activeType];

  return (
    <section className="section content-types" id="content-types">
      <div className="container">
        <SectionHeading
          eyebrow="Built for real work"
          title="One studio. Ten ways to get started."
          description="Choose a purpose-built format and get guidance that matches the job—not a one-size-fits-all prompt box."
        />
        <div className="content-types__grid">
          {contentTypes.map((type, index) => (
            <button
              className={`type-card ${activeType === index ? 'type-card--active' : ''}`}
              type="button"
              key={type.name}
              onClick={() => setActiveType(index)}
              aria-pressed={activeType === index}
            >
              <span className={`type-card__icon type-card__icon--${type.color}`} aria-hidden="true">{type.icon}</span>
              <span className="type-card__name">{type.name}</span>
              <span className="type-card__arrow" aria-hidden="true">↗</span>
            </button>
          ))}
        </div>
        <div className="type-example" aria-live="polite">
          <span className={`type-card__icon type-card__icon--${selectedType.color}`} aria-hidden="true">{selectedType.icon}</span>
          <div>
            <span className="type-example__label">What you can create</span>
            <h3>{selectedType.name}</h3>
            <p>{selectedType.example}</p>
          </div>
          <a href="/signup">Create this <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
}
