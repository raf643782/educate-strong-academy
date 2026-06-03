interface CourseDateSectionProps {
  heading: string;
  copy: string;
  subCopy: string;
  contactEmail: string;
  courseTitle?: string;
}

export default function CourseDateSection({
  heading,
  copy,
  subCopy,
  contactEmail,
  courseTitle = 'this course',
}: CourseDateSectionProps) {
  const registerHref = `mailto:${contactEmail}?subject=Register%20Interest%20—%20${encodeURIComponent(courseTitle)}`;

  return (
    <section className="bg-white py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-5">{heading}</h2>

          <p className="text-gray-700 leading-relaxed mb-4">{copy}</p>
          <p className="text-gray-500 text-sm leading-relaxed mb-8">{subCopy}</p>

          <a
            href={registerHref}
            className="inline-block bg-gray-900 hover:bg-gray-700 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm"
          >
            Register Interest
          </a>

          <p className="text-xs text-gray-400 mt-4">
            No payment is taken when you register interest. You will be contacted directly when a course date is confirmed.
          </p>
        </div>
      </div>
    </section>
  );
}
