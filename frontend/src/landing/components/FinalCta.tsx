export function FinalCta() {
  return (
    <section className="section final-cta" id="get-started">
      <div className="container">
        <div className="final-cta__card">
          <div className="final-cta__orb final-cta__orb--one" />
          <div className="final-cta__orb final-cta__orb--two" />
          <p className="section-heading__eyebrow">Ready when you are</p>
          <h2>Give your next idea a stronger first draft.</h2>
          <p>Choose a format, add your direction, and turn the blank page into something useful.</p>
          <a className="button button--light" href="/signup">
            Open Content Studio
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
