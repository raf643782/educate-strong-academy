import { Link } from 'react-router-dom';

interface CourseFinalCTAProps {
  courseTitle: string;
  contactEmail: string;
  interestType: string;
  pricing: { totalFee: number; deposit: number };
}

export default function CourseFinalCTA({ courseTitle, contactEmail, interestType, pricing }: CourseFinalCTAProps) {
  const registerInterestHref = `/register-interest?type=${encodeURIComponent(interestType)}`;
  const contactHref = `mailto:${contactEmail}?subject=Course%20Enquiry%20—%20${encodeURIComponent(courseTitle)}`;
  return (
    <section className="es-grit" style={{
      background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(164,28,100,0.22) 0%, transparent 65%), #050506',
      position: 'relative',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ letterSpacing: '-0.03em' }}>Ready to Take the Next Step?</h2>
          <p className="text-es-muted mb-2">Spaces are limited. Contact Educate.Strong to secure your place.</p>
          <p className="text-es-subtle text-sm mb-8">Deposit: £{pricing.deposit} — Total: £{pricing.totalFee}. Booking details confirmed directly.</p>
          <div className="flex flex-wrap gap-4">
            <Link to={registerInterestHref} className="btn-primary">Secure Your Place</Link>
            <a href={contactHref} className="btn-secondary">Contact Educate.Strong</a>
          </div>
        </div>
      </div>
    </section>
  );
}
