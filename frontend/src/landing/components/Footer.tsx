import { Brand } from './Brand';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Brand />
          <p>A focused AI content studio for everyday professional writing.</p>
        </div>
        <div className="footer__links">
          <a href="#how-it-works">How it works</a>
          <a href="#content-types">Content types</a>
          <a href="#features">Features</a>
        </div>
        <p className="footer__copyright">© {new Date().getFullYear()} AI WorkMate</p>
      </div>
    </footer>
  );
}
