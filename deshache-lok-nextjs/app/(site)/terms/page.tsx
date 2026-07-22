import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions | देशाचे लोक',
};

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-extrabold text-neutral-900 mb-6">Terms & Conditions</h1>
      <div className="prose prose-neutral">
        <p>
          Welcome to <strong>देशाचे लोक</strong> (Deshache Lok). By using our web application, you agree to comply with and be
          bound by the following terms and conditions.
        </p>

        <h3>1. Acceptance of Terms</h3>
        <p>By accessing or using our platform, you accept these terms in full. If you disagree with these terms, you must not use our platform.</p>

        <h3>2. User Accounts</h3>
        <p>
          To publish content, you must create an account. You are responsible for maintaining the confidentiality of your
          account credentials and for all activities that occur under your account.
        </p>

        <h3>3. Content Ownership and Licensing</h3>
        <p>
          You retain ownership of the content you publish on our platform. However, by publishing content, you grant us a
          worldwide, non-exclusive, royalty-free license to use, reproduce, distribute, and display that content in
          connection with our services.
        </p>

        <h3>4. Disclaimer of Warranties</h3>
        <p>Our platform is provided &quot;as is&quot; without any warranties, express or implied. We do not warrant that the platform will be constantly available or free of errors.</p>

        <h3>5. Limitation of Liability</h3>
        <p>We shall not be liable for any indirect, special, or consequential loss or damage arising under these terms or in connection with our platform.</p>

        <h3>6. Changes to Terms</h3>
        <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting to the platform.</p>
      </div>
    </div>
  );
}
