import type { TutorData } from '../../data/coursePageData';

interface CourseTutorsProps {
  heading?: string;
  intro?: string;
  tutors: TutorData[];
}

export default function CourseTutors({
  heading = 'Taught by Coaches With the Record to Back It',
  intro,
  tutors,
}: CourseTutorsProps) {
  return (
    <section className="bg-white py-16 md:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{heading}</h2>
          {intro && (
            <p className="text-gray-600 text-base leading-relaxed max-w-2xl">{intro}</p>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {tutors.map((tutor) => (
            <div
              key={tutor.name}
              className="border border-gray-200 rounded-xl overflow-hidden flex flex-col"
            >
              {/* Photo placeholder */}
              <div className="bg-gray-100 h-56 flex items-center justify-center flex-shrink-0">
                <div className="text-center px-6">
                  <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-3" />
                  <p className="text-xs text-gray-400 leading-snug">{tutor.photoAlt}</p>
                  <p className="text-xs text-gray-300 mt-1">Photo to be provided by Educate.Strong</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900">{tutor.name}</h3>
                  <p className="text-sm text-amber-600 font-medium">{tutor.role}</p>
                </div>

                {/* Credentials */}
                <ul className="space-y-1.5 mb-5">
                  {tutor.credentials.map((cred) => (
                    <li key={cred} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg
                        className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {cred}
                    </li>
                  ))}
                </ul>

                {/* Description */}
                <p className="text-sm text-gray-600 leading-relaxed mt-auto">{tutor.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
