import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | देशाचे लोक',
};

export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-extrabold text-neutral-900 mb-6">Privacy Policy</h1>
      <div className="prose prose-neutral">
        <p>
          At <strong>देशाचे लोक</strong> (Deshache Lok), your privacy is important to us. This Privacy Policy outlines the
          types of personal information we receive and collect when you use our platform, and how we safeguard your
          information.
        </p>

        <h3>1. Information We Collect</h3>
        <p>
          We may collect personal information such as your name, email address, and profile picture when you sign up for
          an account. We also collect non-personal information such as browser type, referring site, and the date and time
          of each visitor request.
        </p>

        <h3>2. How We Use Information</h3>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, operate, and maintain our platform.</li>
          <li>Improve, personalize, and expand our services.</li>
          <li>Understand and analyze how you use our platform.</li>
          <li>Communicate with you, either directly or through one of our partners.</li>
        </ul>

        <h3>3. Information Sharing</h3>
        <p>We do not share your personal information with third parties except as necessary to provide our services, comply with the law, or protect our rights.</p>

        <h3>4. Data Security</h3>
        <p>We use reasonable organizational, technical, and administrative measures to protect personal information under our control. However, no data transmission over the Internet can be guaranteed to be 100% secure.</p>

        <h3>5. Third-Party Services</h3>
        <p>Our platform may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.</p>

        <h3>6. Changes to This Privacy Policy</h3>
        <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
      </div>
    </div>
  );
}
