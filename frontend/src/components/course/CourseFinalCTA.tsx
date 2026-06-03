interface CourseFinalCTAProps {
  courseTitle: string;
  contactEmail: string;
  pricing: { totalFee: number; deposit: number };
}

export default function CourseFinalCTA({ courseTitle, contactEmail, pricing }: CourseFinalCTAProps) {
  const securePlaceHref = `mailto:${contactEmail}?subject=Secure%20My%20Place%20—%20${encodeURIComponent(courseTitle)}`;
  const contactHref = `mailto:${contactEmail}?subject=Course%20Enquiry%20—%20${encodeURIComponent(courseTitle)}`;

  return (
    <section className="bg-gray-900 text-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Take the Next Step?</h2>
          <p className="text-gray-400 mb-2">
            Spaces are limited. Contact Educate.Strong to secure your place.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            Deposit: £{pricing.deposit} — Total: £{pricing.totalFee}. Booking details confirmed directly.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href={securePlaceHref}
              className="bg-amber-600 hover:bg-amber-500 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm"
            >
              Secure Your Place
            </a>
            <a
              href={contactHref}
              className="border border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium px-7 py-3.5 rounded-lg transition-colors text-sm"
            >
              Contact Educate.Strong
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
