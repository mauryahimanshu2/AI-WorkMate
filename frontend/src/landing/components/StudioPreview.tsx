const previewLines = ['92%', '100%', '78%'];

export function StudioPreview() {
  return (
    <div className="studio-visual" aria-label="Preview of the AI Content Studio">
      <div className="floating-note floating-note--top">
        <span>✦</span>
        Draft ready in moments
      </div>

      <div className="studio-card">
        <div className="studio-card__topbar">
          <div className="studio-card__window-dots" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <span className="studio-card__status">AI Content Studio</span>
          <span className="studio-card__saved">Saved</span>
        </div>

        <div className="studio-card__body">
          <aside className="studio-sidebar">
            <span className="studio-sidebar__label">Create</span>
            <span className="studio-sidebar__item studio-sidebar__item--active">✉ Email</span>
            <span className="studio-sidebar__item">▤ Blog article</span>
            <span className="studio-sidebar__item"># Social post</span>
            <span className="studio-sidebar__item">◇ Marketing</span>
          </aside>

          <div className="studio-editor">
            <div className="studio-editor__meta">
              <span>PROFESSIONAL EMAIL</span>
              <span className="tone-pill">Friendly</span>
            </div>
            <h2>Project launch update</h2>
            <p className="studio-editor__greeting">Hi team,</p>
            <div className="preview-copy" aria-hidden="true">
              {previewLines.map((width) => <span key={width} style={{ width }} />)}
            </div>
            <div className="studio-editor__callout">
              <span className="sparkle">✦</span>
              <div>
                <strong>Make it more concise</strong>
                <p>Keep the key details and sharpen the tone.</p>
              </div>
              <button type="button" aria-label="Apply improvement">Apply</button>
            </div>
            <div className="studio-editor__footer">
              <span>142 words</span>
              <div>
                <button type="button">Copy</button>
                <button type="button" className="studio-editor__save">Save draft</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="floating-note floating-note--bottom">
        <span className="floating-note__check">✓</span>
        <div>
          <strong>Clarity improved</strong>
          <small>Original version preserved</small>
        </div>
      </div>
    </div>
  );
}
