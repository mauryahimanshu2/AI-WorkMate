import { ContentTypes } from '../components/ContentTypes';
import { Features } from '../components/Features';
import { FinalCta } from '../components/FinalCta';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { Workflow } from '../components/Workflow';

export function LandingPage() {
  return (
    <div className="site-shell">
      <Header />
      <main>
        <Hero />
        <Workflow />
        <ContentTypes />
        <Features />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
