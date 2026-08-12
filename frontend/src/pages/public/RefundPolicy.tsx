import LegalPageLayout from '../../components/legal/LegalPageLayout';
import { CONTACT_EMAIL } from '../../lib/contact';
import { useDocumentHead } from '../../hooks/useDocumentHead';

export default function RefundPolicy() {
  useDocumentHead({ title: 'Refund & Cancellation Policy', noindex: true });

  return (
    <LegalPageLayout title="Refund & Cancellation Policy">
      <p className="text-xs uppercase tracking-wide" style={{ color: '#E19A47' }}>
        [LEGAL REVIEW REQUIRED] — this page is a placeholder draft and has not been reviewed by a qualified legal professional. Do not treat it as final.
      </p>

      <p>
        This is a general summary of our approach to deposits, cancellations, and refunds for
        in-person courses. As stated on individual course pages, the specific cancellation and
        deposit terms for your booking are confirmed directly with you and included in your
        booking confirmation.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">Deposits</h2>
      <p>
        Where a course lists a deposit amount, that deposit secures your place on the course.
        [LEGAL REVIEW REQUIRED] — whether deposits are refundable, and under what circumstances,
        has not yet been defined and needs review before this page is treated as final.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">Cancelling a Booking</h2>
      <p>
        If you need to cancel or change a booking, contact Educate.Strong directly using the details
        below as early as possible. [LEGAL REVIEW REQUIRED] — a specific cancellation window and
        refund schedule has not yet been defined.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">If a Course Is Cancelled by Us</h2>
      <p>
        [LEGAL REVIEW REQUIRED] — our position on refunds if we cancel or reschedule a course has
        not yet been defined and needs review before this page is treated as final.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">Contact</h2>
      <p>
        For any booking, cancellation, or refund question, contact{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: '#A41C64' }}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPageLayout>
  );
}
