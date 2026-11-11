const templates = [
  { id: 'professional_email', icon: '✉', title: 'Professional Email', description: 'Write a clear, polished business email.', color: 'coral' },
  { id: 'social_media_post', icon: '#', title: 'Social Post', description: 'Create a post shaped for your platform.', color: 'violet' },
  { id: 'blog_article', icon: '▤', title: 'Blog Article', description: 'Build a structured, useful article draft.', color: 'gold' },
  { id: 'marketing_copy', icon: '↗', title: 'Marketing Copy', description: 'Turn benefits into focused campaign copy.', color: 'mint' },
];

export function QuickTemplates() {
  return (
    <section className="dashboard-section" id="templates">
      <div className="dashboard-section__heading">
        <div>
          <p>Quick start</p>
          <h2>Choose a starting point</h2>
        </div>
        <span>Select the format that best matches your goal.</span>
      </div>
      <div className="template-grid">
        {templates.map((template) => (
            <a
              className="template-card"
              href={`/studio?type=${template.id}`}
              key={template.id}
            >
              <span className={`template-card__icon template-card__icon--${template.color}`} aria-hidden="true">{template.icon}</span>
              <strong>{template.title}</strong>
              <p>{template.description}</p>
              <span className="template-card__action">Use template →</span>
            </a>
        ))}
      </div>
    </section>
  );
}
