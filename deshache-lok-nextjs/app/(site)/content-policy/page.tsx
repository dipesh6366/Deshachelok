import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Policy & Community Guidelines | देशाचे लोक',
};

export default function ContentPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
      <h1 className="text-3xl font-extrabold text-neutral-900 mb-6">Content Policy & Community Guidelines</h1>
      <div className="prose prose-neutral">
        <p>
          <strong>देशाचे लोक</strong> (Deshache Lok) is a platform for sharing news, opinions, and knowledge. To maintain a
          safe and respectful environment, all users must adhere to the following guidelines.
        </p>

        <h3>1. Allowed Content</h3>
        <p>We welcome and encourage the following types of content:</p>
        <ul>
          <li>News and current events</li>
          <li>Opinions and editorial pieces</li>
          <li>Agriculture and rural affairs</li>
          <li>Politics and governance</li>
          <li>Sports and entertainment</li>
          <li>Educational and informative content</li>
        </ul>

        <h3>2. Prohibited Content</h3>
        <p>
          The following content is strictly prohibited on our platform. We operate a notice-and-takedown policy. If we
          become aware of content violating these rules, it will be removed:
        </p>
        <ul>
          <li><strong>Pornographic or sexually explicit content:</strong> No explicit imagery, videos, or excessively descriptive text.</li>
          <li><strong>Child sexual abuse material (CSAM):</strong> Strictly prohibited and will be reported to relevant authorities.</li>
          <li><strong>Graphic violence:</strong> Content posted primarily for shock value, gore, or promoting violence is not allowed.</li>
          <li><strong>Hate speech or incitement to violence:</strong> Content that attacks or demeans groups based on race, religion, ethnicity, gender, sexual orientation, or disability.</li>
          <li><strong>Defamation or knowingly false accusations:</strong> Spreading malicious lies or unverified accusations targeting individuals or organizations.</li>
          <li><strong>Copyright infringement:</strong> Posting content you do not own the rights to, without permission.</li>
          <li><strong>Spam, scams, phishing, and malware:</strong> Malicious links, automated spam, or deceptive practices.</li>
          <li><strong>Illegal activities:</strong> Content promoting or facilitating illegal acts.</li>
        </ul>

        <h3>3. Copyright / DMCA Policy</h3>
        <p>
          We respect the intellectual property rights of others. If you believe your copyright has been infringed, please
          report the article or contact our administrative team. We will review the claim and remove infringing content in
          accordance with applicable laws.
        </p>

        <h3>4. Reporting and Enforcement</h3>
        <p>
          Every article features a &quot;Report Article&quot; button. If you see content that violates these guidelines, please
          report it. Our administrative team reviews reports and will take appropriate action, which may include:
        </p>
        <ul>
          <li>Removing the violating content.</li>
          <li>Suspending or banning the offending user account.</li>
          <li>Cooperating with legal requests when required by law.</li>
        </ul>

        <h3>5. Grievance Officer</h3>
        <p>For any urgent legal or policy concerns, our platform administrators can be reached and will take prompt action on reported violations.</p>
      </div>
    </div>
  );
}
