import { ReactNode } from 'react';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

interface LegalPageLayoutProps {
  title: string;
  children: ReactNode;
}

export default function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#0D0D0D' }}>
      <Navbar />
      <main className="pt-navbar flex-1">
        <section className="es-container py-16 max-w-3xl">
          <p className="es-label mb-3">Legal</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-8" style={{ letterSpacing: '-0.03em' }}>
            {title}
          </h1>
          <div className="space-y-6 text-es-muted text-sm leading-relaxed">
            {children}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
