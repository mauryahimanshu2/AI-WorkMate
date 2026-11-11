import { SectionHeading } from './SectionHeading';

const steps = [
  { number: '01', icon: '◎', title: 'Choose your format', description: 'Start with the content type that fits your goal—from emails to proposals.' },
  { number: '02', icon: '✎', title: 'Add your direction', description: 'Share the topic, audience, tone, language, and details that matter.' },
  { number: '03', icon: '✦', title: 'Create and refine', description: 'Generate a focused draft, then rewrite, shorten, translate, or polish it.' },
];

export function Workflow() {
  return (
    <section className="section workflow" id="how-it-works">
      <div className="container">
        <SectionHeading
          eyebrow="A simpler workflow"
          title="From idea to ready-to-use in three steps"
          description="You bring the context. AI WorkMate handles the structure, the first draft, and the time-consuming edits."
        />
        <div className="workflow__grid">
          {steps.map((step, index) => (
            <article className="workflow-card" key={step.number}>
              <div className="workflow-card__top">
                <span className="workflow-card__icon" aria-hidden="true">{step.icon}</span>
                <span className="workflow-card__number">{step.number}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              {index < steps.length - 1 && <span className="workflow-card__arrow" aria-hidden="true">→</span>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
