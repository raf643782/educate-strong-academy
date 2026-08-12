import LegalPageLayout from '../../components/legal/LegalPageLayout';
import { CONTACT_EMAIL } from '../../lib/contact';
import { useDocumentHead } from '../../hooks/useDocumentHead';

export default function Terms() {
  useDocumentHead({ title: 'Terms of Service', noindex: true });

  return (
    <LegalPageLayout title="Terms of Service">
      <p className="text-xs uppercase tracking-wide" style={{ color: '#E19A47' }}>
        [LEGAL REVIEW REQUIRED] — this page is a placeholder draft and has not been reviewed by a qualified legal professional. Do not treat it as final.
      </p>

      <p>
        These Terms of Service govern your use of the Educate.Strong Academy website and the courses,
        qualifications, and content offered through it, operated by Educate.Strong Ltd, a company
        registered in England and Wales (company number [COMPANY NUMBER]), registered office at
        [REGISTERED ADDRESS].
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">1. Course Bookings and Fees</h2>
      <p>
        Course fees and deposit amounts are shown on each individual course page. Where a course lists
        a deposit (for example, a £100 deposit against a £500 total fee for Level 1 Coaching), the
        deposit secures a place on that course and the remaining balance is due on the terms set out
        in your booking confirmation.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">2. Cancellations and Refunds</h2>
      <p>
        Specific cancellation and refund terms for a booked course are confirmed directly with you at
        the time of booking, as stated on the relevant course page. See our{' '}
        <a href="/refund-policy" className="underline" style={{ color: '#A41C64' }}>Refund &amp; Cancellation Policy</a>{' '}
        for the general position.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">3. Accounts</h2>
      <p>
        You are responsible for keeping your account credentials secure and for all activity under
        your account. You must provide accurate information when registering.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">4. Acceptable Use</h2>
      <p>
        You agree not to misuse the site, attempt to gain unauthorised access to accounts or systems,
        or reproduce course content for commercial redistribution without permission.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">5. Intellectual Property</h2>
      <p>
        Course materials, articles, and other content on this site remain the property of
        Educate.Strong Ltd or its licensors and may not be copied or redistributed without permission.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">6. Liability</h2>
      <p>
        [LEGAL REVIEW REQUIRED] — liability limitations for in-person training, including physical
        risk associated with Strongman coaching and practical sessions, need to be drafted and
        reviewed by a qualified professional before this page is treated as final.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">7. Changes to These Terms</h2>
      <p>
        We may update these terms from time to time. Continued use of the site after changes are
        published constitutes acceptance of the updated terms.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">8. Contact</h2>
      <p>
        Questions about these terms can be sent to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: '#A41C64' }}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPageLayout>
  );
}
