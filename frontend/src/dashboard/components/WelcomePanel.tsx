interface WelcomePanelProps {
  name: string;
}

export function WelcomePanel({ name }: WelcomePanelProps) {
  const firstName = name.trim().split(' ')[0] || 'there';
  const formattedDate = new Intl.DateTimeFormat('en', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

  return (
    <section className="welcome-panel" id="overview">
      <div className="welcome-panel__content">
        <p>{formattedDate}</p>
        <h1>Good to see you, {firstName}.</h1>
        <span>What would you like to create today?</span>
        <a href="#templates">Start creating <span aria-hidden="true">→</span></a>
      </div>
      <div className="welcome-illustration" aria-hidden="true">
        <div className="welcome-illustration__paper">
          <span />
          <span />
          <span />
          <strong>✦</strong>
        </div>
        <div className="welcome-illustration__pen" />
        <span className="welcome-illustration__spark">✦</span>
        <span className="welcome-illustration__spark welcome-illustration__spark--small">✦</span>
      </div>
    </section>
  );
}
