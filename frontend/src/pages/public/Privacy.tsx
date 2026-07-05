import LegalPageLayout from '../../components/legal/LegalPageLayout';
import { CONTACT_EMAIL } from '../../lib/contact';
import { useDocumentHead } from '../../hooks/useDocumentHead';

export default function Privacy() {
  useDocumentHead({ title: 'Privacy Policy' });

  return (
    <LegalPageLayout title="Privacy Policy">
      <p className="text-xs uppercase tracking-wide" style={{ color: '#E19A47' }}>
        [LEGAL REVIEW REQUIRED] — this page is a placeholder draft and has not been reviewed by a qualified legal professional. Do not treat it as final.
      </p>

      <p>
        This policy explains what personal data Educate.Strong Academy collects and how it is used.
        Educate.Strong Ltd (company number [COMPANY NUMBER], registered office at
        [REGISTERED ADDRESS]) is the data controller.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">1. What We Collect</h2>
      <p>
        Depending on how you use the site, we may collect: your name, email address, and password
        when you create a learner account; your name, email address, and any phone number, postcode,
        or message you provide when you register interest in a course or subscribe to our newsletter;
        and your course progress, enrolments, and certificates once you are logged in.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">2. How We Use It</h2>
      <p>
        We use this data to operate your account, deliver course content and track your progress,
        respond to enquiries you submit through the register-interest form, and send newsletter
        emails to those who have subscribed.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">3. Embedded Content</h2>
      <p>
        Our homepage loads an Instagram embed script, which may set cookies or collect data in
        accordance with Instagram's own privacy policy. This is outside our control once loaded.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">4. Data Retention</h2>
      <p>
        [LEGAL REVIEW REQUIRED] — specific retention periods for account data, enquiry submissions,
        and certificates have not yet been defined and need review before this page is treated as
        final.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">5. Your Rights</h2>
      <p>
        You can ask us what personal data we hold about you, ask us to correct it, or ask us to
        delete your account data, by contacting us using the details below.
      </p>

      <h2 className="text-white font-bold text-base mt-8 mb-2">6. Contact</h2>
      <p>
        Questions about this policy or your data can be sent to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="underline" style={{ color: '#A41C64' }}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalPageLayout>
  );
}
