import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowUpRight,
  Cake,
  ChevronRight,
  CircleAlert,
  Coins,
  Code2,
  Copyright,
  FileText,
  Gavel,
  HandHeart,
  LifeBuoy,
  LockKeyhole,
  ShieldCheck,
  Users,
} from 'lucide-react';

const LAST_UPDATED = 'August 28, 2026';

const LEGAL_DOCUMENTS = [
  {
    slug: 'terms-of-service',
    label: 'Terms of Service',
    shortLabel: 'Terms',
    description: 'The agreement that governs your use of Whisper.',
    icon: FileText,
    tone: 'bg-primary/10 text-primary',
    intro: 'These terms explain the relationship between you and Whisper when you use our messaging and community features.',
    sections: [
      {
        heading: '1. Accepting these terms',
        paragraphs: [
          'By creating an account, accessing Whisper, or using any Whisper feature, you agree to these Terms of Service and the policies linked from them. If you do not agree, do not use the service.',
          'You must have the legal capacity to enter this agreement. If you use Whisper on behalf of an organization, you confirm that you have authority to bind that organization.',
        ],
      },
      {
        heading: '2. Your account',
        paragraphs: [
          'You are responsible for keeping your sign-in details secure and for activity that happens through your account. Use accurate information, do not impersonate another person, and tell us promptly if you believe your account is compromised.',
          'One person may not use Whisper to create accounts for evading enforcement, manipulating conversations, or misleading other people.',
        ],
      },
      {
        heading: '3. Your content and conversations',
        paragraphs: [
          'You keep ownership of the content you create. You give Whisper the limited permissions needed to host, transmit, display, and protect that content so the service can work for you and the people you choose to contact.',
          'You are responsible for having the rights and permissions required for anything you share. Do not upload content that violates another person’s rights or these policies.',
        ],
      },
      {
        heading: '4. Acceptable use',
        paragraphs: ['You may not use Whisper to:',],
        bullets: [
          'Threaten, exploit, harass, stalk, or target people with abuse or discrimination.',
          'Share malware, phishing links, fraud, spam, or instructions for illegal harm.',
          'Attempt to access accounts, systems, messages, or data that are not yours.',
          'Circumvent rate limits, safety controls, moderation decisions, or age requirements.',
          'Build or operate an automated system that creates meaningful risk for people or the service.',
        ],
      },
      {
        heading: '5. Service changes and enforcement',
        paragraphs: [
          'Whisper may improve, suspend, or discontinue features, including for maintenance, security, legal compliance, or abuse prevention. We may restrict or terminate access when an account violates these terms or creates risk for others.',
          'Where appropriate, we will provide notice and an opportunity to appeal. Some urgent safety or legal situations may require immediate action.',
        ],
      },
      {
        heading: '6. Disclaimers and contact',
        paragraphs: [
          'Whisper is provided on an as-available basis. To the extent permitted by law, we do not promise that the service will always be uninterrupted, error-free, or suitable for every purpose. Nothing in these terms limits rights that cannot legally be limited.',
          'Questions about these terms can be sent to legal@whisper.app. We may update these terms by publishing a new version and changing the date above.',
        ],
      },
    ],
  },
  {
    slug: 'community-guidelines',
    label: 'Community Guidelines',
    shortLabel: 'Community',
    description: 'The standards that help Whisper stay thoughtful, private, and human.',
    icon: Users,
    tone: 'bg-accent/12 text-accent',
    intro: 'Whisper is a quieter place to connect. These guidelines describe the behavior we expect and the harm we work to prevent.',
    sections: [
      {
        heading: 'Lead with care',
        paragraphs: ['Treat people as people, not as targets. Disagreement is welcome; humiliation, intimidation, and coordinated abuse are not. Make room for context, consent, and boundaries.'],
      },
      {
        heading: 'No threats or targeted abuse',
        paragraphs: ['Do not threaten violence, encourage self-harm, expose someone’s private information, or repeatedly contact someone after they have asked you to stop. Slurs and attacks based on protected characteristics are not allowed.'],
      },
      {
        heading: 'Protect privacy',
        paragraphs: ['Share only what you have the right to share. Do not publish private contact details, intimate images, account credentials, or sensitive personal information without permission. Respect the private nature of conversations.'],
      },
      {
        heading: 'Keep the space authentic',
        paragraphs: ['Do not use bots, fake identities, spam campaigns, scams, or coordinated manipulation to distort conversations or pressure people. Clearly disclose automation when it is part of an experience.'],
      },
      {
        heading: 'Reporting and enforcement',
        paragraphs: ['Use in-app reporting, block tools, or contact safety@whisper.app when something feels unsafe. We may remove content, limit features, suspend accounts, or involve appropriate authorities where required. Reports are reviewed with attention to context and privacy.'],
      },
    ],
  },
  {
    slug: 'privacy-policy',
    label: 'Privacy Policy',
    shortLabel: 'Privacy',
    description: 'How Whisper collects, uses, protects, and gives you control over information.',
    icon: LockKeyhole,
    tone: 'bg-emerald-500/10 text-emerald-600',
    intro: 'This policy explains what information Whisper handles when you use the service and the choices available to you.',
    sections: [
      {
        heading: 'Information you provide',
        paragraphs: ['We may handle account identifiers, profile details, messages, media, reports, support requests, and preferences such as language and auto-translation settings. You choose what to put in your profile and conversations.'],
      },
      {
        heading: 'Information collected automatically',
        paragraphs: ['We may receive device, browser, log, diagnostic, and approximate usage information needed to operate, secure, and improve the service. Whisper may store local preferences and translation cache data on your device.'],
      },
      {
        heading: 'How we use information',
        paragraphs: ['We use information to provide messaging, authenticate accounts, deliver notifications, translate content when you request or enable translation, prevent abuse, troubleshoot issues, measure reliability, and meet legal obligations.'],
      },
      {
        heading: 'Sharing and service providers',
        paragraphs: ['We may share information with vendors that help host, secure, store, moderate, or process the service, under appropriate instructions. We do not sell private message content. We may disclose information when required by law or necessary to address a serious safety, fraud, or security issue.'],
      },
      {
        heading: 'Your choices and retention',
        paragraphs: ['You can update profile information, choose a preferred language, turn auto-translation on or off, block users, and request account or data support through the service. We retain information for as long as needed for the purposes described here, legal obligations, dispute resolution, and security.'],
      },
      {
        heading: 'Contact and updates',
        paragraphs: ['For privacy questions or requests, contact privacy@whisper.app. We will publish material policy changes here with a new effective date.'],
      },
    ],
  },
  {
    slug: 'developer-policy',
    label: 'Developer Policy',
    shortLabel: 'Developer Policy',
    description: 'Rules for developers, bots, integrations, and apps that connect to Whisper.',
    icon: Code2,
    tone: 'bg-sky-500/10 text-sky-600',
    intro: 'Developer access is a privilege. Build useful tools that respect people, consent, privacy, and the limits of the platform.',
    sections: [
      {
        heading: 'Build for people, not extraction',
        paragraphs: ['Apps and bots must have a clear user benefit and must not scrape, profile, surveil, or export Whisper data beyond the permission a person has granted. Collect the minimum data needed for the feature.'],
      },
      {
        heading: 'Consent and transparency',
        paragraphs: ['Tell people when they are interacting with automation, what data your integration receives, why it is used, and how long you keep it. Obtain meaningful consent before sending messages, publishing content, or taking actions on someone’s behalf.'],
      },
      {
        heading: 'Security and reliability',
        paragraphs: ['Protect credentials and tokens, use secure transport, honor rate limits, handle failures safely, and report vulnerabilities responsibly. Never ask users to share Whisper passwords or security codes with your app.'],
      },
      {
        heading: 'Prohibited developer behavior',
        bullets: ['Spam, mass unsolicited messaging, artificial engagement, or evasion of enforcement.', 'Discrimination, harmful profiling, surveillance, credential theft, or deceptive impersonation.', 'Circumventing access controls, reverse engineering private systems, or reselling platform data.', 'Using the platform to facilitate illegal activity or high-risk decisions without appropriate safeguards.'],
      },
      {
        heading: 'Review and enforcement',
        paragraphs: ['Whisper may review an integration, limit its access, require changes, or suspend credentials when an app violates this policy or creates risk. Developers should provide a working contact and respond to safety or security requests promptly.'],
      },
    ],
  },
  {
    slug: 'developer-terms',
    label: 'Developer Terms',
    shortLabel: 'Developer Terms',
    description: 'The platform agreement for building with Whisper APIs and integrations.',
    icon: Gavel,
    tone: 'bg-violet-500/10 text-violet-600',
    intro: 'These terms apply when you access developer tools, APIs, SDKs, webhooks, or other platform surfaces made available by Whisper.',
    sections: [
      {
        heading: 'Access and license',
        paragraphs: ['Subject to these terms, Whisper grants you a limited, revocable, non-exclusive license to use the developer surfaces documented for your integration. You may not transfer access or use platform materials outside their intended purpose.'],
      },
      {
        heading: 'Credentials and your application',
        paragraphs: ['Keep API keys, signing secrets, and access tokens confidential. You are responsible for your application, its code, its users, and all activity made through your credentials. Notify Whisper promptly of suspected compromise.'],
      },
      {
        heading: 'User data and content',
        paragraphs: ['Use platform data only for the purpose disclosed to the user and only for as long as necessary. Honor deletion, access, consent, and opt-out requests. Do not combine Whisper data with sensitive profiles or sell it to data brokers.'],
      },
      {
        heading: 'Intellectual property',
        paragraphs: ['You own your application and content. Whisper and its licensors retain ownership of the platform, APIs, documentation, and trademarks. Feedback you provide may be used to improve the platform without creating an obligation to you.'],
      },
      {
        heading: 'Changes and termination',
        paragraphs: ['Platform capabilities, limits, and documentation may change. Whisper may revoke access for security, legal, operational, or policy reasons. When access ends, stop using the platform and delete data you no longer have a lawful reason to retain.'],
      },
    ],
  },
  {
    slug: 'monetization-terms',
    label: 'Monetization Terms',
    shortLabel: 'Monetization',
    description: 'The rules for paid features, creator earnings, and commercial activity.',
    icon: Coins,
    tone: 'bg-amber-500/12 text-amber-700',
    intro: 'These terms apply only to monetization features that Whisper makes available in your region or account.',
    sections: [
      {
        heading: 'Eligibility and enrollment',
        paragraphs: ['Monetization may require age, identity, location, account standing, tax, payment, or other eligibility checks. Enrollment does not guarantee earnings, reach, or continued access to a program.'],
      },
      {
        heading: 'Earnings and payouts',
        paragraphs: ['Program dashboards may show estimates until a payout is finalized. Payout timing, thresholds, fees, currency conversion, and payment-provider rules will be shown for the specific program. You are responsible for accurate payout details and applicable taxes.'],
      },
      {
        heading: 'What cannot be monetized',
        bullets: ['Content that violates the Terms of Service or Community Guidelines.', 'Copyright-infringing, deceptive, fraudulent, or artificially generated engagement.', 'Commercial offers that require unsafe activity, exploit minors, or mislead people about price or identity.', 'Content or activity that a program specifically excludes in its enrollment rules.'],
      },
      {
        heading: 'Reviews, holds, and reversals',
        paragraphs: ['Whisper may review activity, hold or reverse amounts, limit visibility, or pause payouts when there is suspected fraud, dispute, policy violation, legal risk, or payment-provider issue. We will provide additional program-specific information when available.'],
      },
      {
        heading: 'Program changes',
        paragraphs: ['Monetization programs can change or end. Continued participation after updated terms take effect means you accept the updated program terms.'],
      },
    ],
  },
  {
    slug: 'safety-center',
    label: 'Safety Center',
    shortLabel: 'Safety',
    description: 'Practical guidance for safer conversations, accounts, and communities.',
    icon: LifeBuoy,
    tone: 'bg-rose-500/10 text-rose-600',
    intro: 'Safety works best as a shared habit. Use the tools below and ask for help when something feels wrong.',
    sections: [
      {
        heading: 'Secure your account',
        bullets: ['Use a unique password and never share a password or one-time code.', 'Review sessions and profile details when something changes unexpectedly.', 'Avoid unknown links, downloads, and requests for urgent money or credentials.'],
      },
      {
        heading: 'Control your experience',
        paragraphs: ['Block accounts that make you uncomfortable, leave rooms that feel unsafe, and report messages or profiles that violate the rules. Keep sensitive details out of public profile fields.'],
      },
      {
        heading: 'When someone may be in immediate danger',
        paragraphs: ['Whisper is not an emergency service. Contact local emergency services or a trusted crisis and safeguarding organization in your region when there is an immediate risk of harm.'],
      },
      {
        heading: 'How reports are handled',
        paragraphs: ['Reports are reviewed for context, urgency, and policy impact. We may ask for details, preserve relevant information, limit an account, or refer a serious matter to appropriate authorities where legally permitted or required.'],
      },
      {
        heading: 'Safety contact',
        paragraphs: ['For urgent platform safety issues, contact safety@whisper.app. Do not include passwords, recovery codes, or unnecessary sensitive information in a report.'],
      },
    ],
  },
  {
    slug: 'copyright-dmca',
    label: 'Copyright / DMCA',
    shortLabel: 'Copyright / DMCA',
    description: 'Information for copyright owners, users, and removal requests.',
    icon: Copyright,
    tone: 'bg-slate-500/10 text-slate-700',
    intro: 'Whisper respects intellectual property rights and responds to valid notices under applicable copyright law.',
    sections: [
      {
        heading: 'Before sending a notice',
        paragraphs: ['Make sure you own the work or are authorized to act for the owner. Consider whether the use may be licensed, permitted, or protected by an exception such as fair use before requesting removal.'],
      },
      {
        heading: 'What a notice should include',
        bullets: ['Identification of the copyrighted work claimed to be infringed.', 'The specific Whisper location or description of the allegedly infringing material.', 'Your contact information and a statement that you have a good-faith belief the use is unauthorized.', 'A statement, under penalty of perjury where required, that the information is accurate and that you are authorized to act.', 'Your physical or electronic signature.'],
      },
      {
        heading: 'Counter-notices and restoration',
        paragraphs: ['If content was removed by mistake or misidentification, the affected user may submit a counter-notice where the law allows. We may forward the counter-notice to the complaining party and restore content according to applicable law and our procedures.'],
      },
      {
        heading: 'Repeat infringement',
        paragraphs: ['We may limit or terminate accounts that repeatedly infringe copyrights or other intellectual property rights. We may also remove content that clearly violates rights without waiting for a formal notice.'],
      },
      {
        heading: 'Contact',
        paragraphs: ['Send copyright notices and questions to copyright@whisper.app. This page is general information and is not legal advice.'],
      },
    ],
  },
  {
    slug: 'age-requirements',
    label: 'Age Requirements',
    shortLabel: 'Age',
    description: 'The minimum age and safeguards for younger users.',
    icon: Cake,
    tone: 'bg-pink-500/10 text-pink-600',
    intro: 'Whisper is intended for people who meet the minimum age required where they live.',
    sections: [
      {
        heading: 'Minimum age',
        paragraphs: ['You must be at least 13 years old, or the minimum age required by the law where you live, to create or use a Whisper account. If local law requires a higher age for this type of service, the higher age applies.'],
      },
      {
        heading: 'Young people and guardians',
        paragraphs: ['If you are under the age of majority, use Whisper only with the guidance and permission of a parent or legal guardian when required by local law. Guardians should talk with young people about privacy, strangers, links, reporting, and blocking.'],
      },
      {
        heading: 'No accounts for children below the minimum age',
        paragraphs: ['We do not knowingly collect or maintain accounts belonging to children below the applicable minimum age. If you believe a child has created an account, contact safety@whisper.app with enough information for us to investigate.'],
      },
      {
        heading: 'Age misrepresentation',
        paragraphs: ['Do not misrepresent your age or help another person bypass age controls. We may suspend an account when we have a reasonable basis to believe it does not meet the age requirement.'],
      },
    ],
  },
];

function DocumentCard({ document }) {
  const Icon = document.icon;
  return (
    <Link
      to={`/legal/${document.slug}`}
      className="group flex h-full flex-col rounded-[1.5rem] border border-foreground/10 bg-card/75 p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-foreground/20 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${document.tone}`}>
          <Icon size={20} aria-hidden="true" />
        </div>
        <ArrowUpRight size={17} className="text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
      <div className="mt-7">
        <h2 className="font-heading text-lg font-bold tracking-tight">{document.label}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{document.description}</p>
      </div>
      <span className="mt-auto flex items-center gap-1 pt-6 text-xs font-semibold text-primary">
        Read policy <ChevronRight size={14} />
      </span>
    </Link>
  );
}

function LegalHome() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="border-b border-foreground/10 bg-card/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <Link to="/login" className="flex items-center gap-3" aria-label="Back to Whisper login">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <ShieldCheck size={18} />
            </span>
            <span className="font-heading text-lg font-bold tracking-tight">whisper<span className="text-accent">.</span></span>
          </Link>
          <Link to="/login" className="inline-flex items-center gap-2 rounded-xl border border-foreground/10 px-3 py-2 text-xs font-semibold transition-colors hover:bg-card">
            <ArrowLeft size={14} /> Back to app
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <section className="max-w-3xl">
          <p className="eyebrow mb-4 flex items-center gap-2"><HandHeart size={13} className="text-accent" /> Trust, safety, and clarity</p>
          <h1 className="font-display text-5xl font-semibold leading-[0.98] tracking-[-0.04em] sm:text-6xl">Legal & Safety Center</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">The plain-language policies behind Whisper: how the service works, how we protect people, and what we expect from users, creators, and developers.</p>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><CircleAlert size={14} className="text-accent" /> Last updated {LAST_UPDATED}</span>
            <span>Choose a document to read the full policy.</span>
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Legal and safety documents">
          {LEGAL_DOCUMENTS.map((document) => <DocumentCard key={document.slug} document={document} />)}
        </section>

        <section className="mt-12 rounded-[1.5rem] border border-primary/15 bg-primary/5 p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <ShieldCheck size={19} className="mt-0.5 shrink-0 text-primary" />
            <div>
              <h2 className="font-heading text-sm font-bold">Need help or want to report a concern?</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">For account, privacy, safety, copyright, or developer questions, use the contact address listed in the relevant policy. Do not include passwords or recovery codes in a request.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function LegalDocument({ document }) {
  const navigate = useNavigate();
  const Icon = document.icon;

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="border-b border-foreground/10 bg-card/50">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8 lg:px-12">
          <Link to="/legal" className="flex items-center gap-3" aria-label="Back to Legal and Safety Center">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md"><ShieldCheck size={18} /></span>
            <span className="font-heading text-lg font-bold tracking-tight">whisper<span className="text-accent">.</span></span>
          </Link>
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 rounded-xl border border-foreground/10 px-3 py-2 text-xs font-semibold transition-colors hover:bg-card">
            <ArrowLeft size={14} /> Back
          </button>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[15rem_minmax(0,1fr)] lg:px-12">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Link to="/legal" className="mb-5 inline-flex items-center gap-2 text-xs font-semibold text-primary hover:underline"><ArrowLeft size={13} /> Legal & Safety Center</Link>
          <nav className="flex gap-2 overflow-x-auto pb-2 lg:block lg:space-y-1 lg:overflow-visible" aria-label="Legal documents">
            {LEGAL_DOCUMENTS.map((item) => {
              const ItemIcon = item.icon;
              const active = item.slug === document.slug;
              return (
                <Link key={item.slug} to={`/legal/${item.slug}`} className={`flex min-w-max items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold transition-colors lg:min-w-0 ${active ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-card hover:text-foreground'}`}>
                  <ItemIcon size={14} /> {item.shortLabel}
                </Link>
              );
            })}
          </nav>
        </aside>

        <article className="min-w-0 max-w-3xl">
          <div className="flex items-start gap-4 border-b border-foreground/10 pb-8">
            <div className={`hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:flex ${document.tone}`}><Icon size={24} /></div>
            <div>
              <p className="eyebrow mb-3">Whisper policy</p>
              <h1 className="font-display text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">{document.label}</h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{document.intro}</p>
              <p className="mt-3 text-xs text-muted-foreground">Last updated {LAST_UPDATED}</p>
            </div>
          </div>

          <div className="divide-y divide-foreground/10">
            {document.sections.map((section) => (
              <section key={section.heading} className="py-8 first:pt-7 last:pb-0">
                <h2 className="font-heading text-xl font-bold tracking-tight">{section.heading}</h2>
                {section.paragraphs?.map((paragraph) => <p key={paragraph} className="mt-4 text-sm leading-7 text-muted-foreground">{paragraph}</p>)}
                {section.bullets && (
                  <ul className="mt-4 space-y-3 pl-5 text-sm leading-7 text-muted-foreground">
                    {section.bullets.map((bullet) => <li key={bullet} className="list-disc pl-1">{bullet}</li>)}
                  </ul>
                )}
              </section>
            ))}
          </div>

          <div className="mt-10 border-t border-foreground/10 pt-6 text-xs leading-6 text-muted-foreground">
            This page is written for clarity and may need jurisdiction-specific review before being used as a final legal agreement. If this page conflicts with a signed agreement or mandatory law, the applicable agreement or law controls.
          </div>
        </article>
      </div>
    </div>
  );
}

export default function LegalCenter() {
  const { slug } = useParams();
  const document = LEGAL_DOCUMENTS.find((item) => item.slug === slug);
  return document ? <LegalDocument document={document} /> : <LegalHome />;
}

export { LEGAL_DOCUMENTS };
