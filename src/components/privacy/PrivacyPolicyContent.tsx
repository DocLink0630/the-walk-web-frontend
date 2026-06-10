import Link from "next/link";
import { CONTACT_EMAIL } from "@/data/contact";

interface PolicySection {
  title: string;
  paragraphs: string[];
  bullets?: string[];
}

const SECTIONS: PolicySection[] = [
  {
    title: "Introduction",
    paragraphs: [
      "The Walk Agency and The Walk Model Academy (“we”, “us”, “our”) operate a platform that connects models, students, beauty artists, photographers, and corporate clients in Sri Lanka.",
      "This Privacy Policy explains how we collect, use, store, and protect your personal information when you register, submit an inquiry, or use our website and services.",
      "By creating an account or submitting information through our platform, you agree to the practices described in this policy.",
    ],
  },
  {
    title: "Information we collect",
    paragraphs: [
      "Depending on how you use our platform, we may collect the following types of information:",
    ],
    bullets: [
      "Account details such as your name, email address, and password",
      "Identity and profile information including date of birth, gender, NIC number, address, and contact numbers",
      "Professional details such as measurements, talents, biography, tier, and rate information for models",
      "Images and documents you upload, including profile photos, NIC images, portfolio photos, and work experience images",
      "Client registration details when you register as a corporate client",
      "Technical information such as browser type, device information, and usage data when you interact with our website",
    ],
  },
  {
    title: "How we use your information",
    paragraphs: [
      "We use the information we collect to operate and improve our platform, including:",
    ],
    bullets: [
      "Creating and managing your account",
      "Reviewing and approving model, student, and client registrations",
      "Displaying public model profiles and portfolio content to visitors and signed-in clients",
      "Processing booking inquiries submitted through the platform",
      "Communicating with you about your application, account, or inquiries",
      "Maintaining the security and integrity of our systems",
    ],
  },
  {
    title: "How we store and protect your data",
    paragraphs: [
      "We take the security of your personal information seriously.",
      "All images and documents you upload are stored securely in protected cloud storage. Access is restricted to authorised systems and personnel who need it to operate the platform.",
      "Sensitive personal details — including identity information, contact numbers, addresses, and other profile fields — are encrypted at the database level. This means your data is not stored in plain readable text within our database.",
      "We use industry-standard technical and organisational measures to help prevent unauthorised access, loss, misuse, or alteration of your information.",
    ],
  },
  {
    title: "Who can see your information",
    paragraphs: [
      "Some information is visible publicly on model listings, such as portfolio images and limited profile details intended for discovery by clients.",
      "Other sensitive fields — including rates, measurements, contact details, and identity documents — are restricted and only visible to authorised users or administrators as required for platform operations.",
      "We do not sell your personal information to third parties.",
    ],
  },
  {
    title: "Data retention",
    paragraphs: [
      "We retain your information for as long as your account is active or as needed to provide our services, comply with legal obligations, resolve disputes, and enforce our policies.",
      "If you request deletion of your data, we will remove or anonymise your personal information and associated uploaded files, subject to any legal or operational requirements that require us to retain certain records for a limited period.",
    ],
  },
  {
    title: "Your rights",
    paragraphs: [
      "You have the right to:",
    ],
    bullets: [
      "Request access to the personal information we hold about you",
      "Request correction of inaccurate or incomplete information",
      "Request deletion of your account and associated personal data",
      "Withdraw consent where processing is based on consent, where applicable",
    ],
  },
  {
    title: "How to request deletion",
    paragraphs: [
      "You may request deletion of your account and personal data at any time by contacting us using the details below.",
      "Please include the email address associated with your account and a clear request to delete your data. We may ask you to verify your identity before processing the request.",
      "Once verified, we will delete your personal information and uploaded images from our systems, unless we are required by law to retain certain information.",
    ],
  },
  {
    title: "Cookies and analytics",
    paragraphs: [
      "Our website may use cookies and similar technologies to maintain sessions, improve performance, and understand how visitors use the platform.",
      "You can control cookies through your browser settings. Disabling cookies may affect certain features of the website.",
    ],
  },
  {
    title: "Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy from time to time. When we do, we will revise the “Last updated” date at the top of this page.",
      "We encourage you to review this page periodically so you remain informed about how we protect your information.",
    ],
  },
  {
    title: "Contact us",
    paragraphs: [
      "If you have questions about this Privacy Policy, wish to exercise your rights, or want to request deletion of your data, please contact us:",
    ],
    bullets: [
      `Email: ${CONTACT_EMAIL}`,
      "The Walk Model Academy, Colombo Road, Pepiliyane, Sri Lanka",
    ],
  },
];

const LAST_UPDATED = "10 June 2026";

export default function PrivacyPolicyContent() {
  return (
    <main className="flex-1 min-h-screen bg-white pt-[88px] md:pt-[96px] pb-20 md:pb-28">
      <div className="max-w-[800px] mx-auto px-4 md:px-8 lg:px-[80px]">
        <header className="mb-10 md:mb-14">
          <p className="font-ui text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-[#C8A97A] mb-4">
            Legal
          </p>
          <h1 className="font-display text-[40px] md:text-[56px] lg:text-[64px] font-light text-[#0A0A0A] leading-[0.95] mb-4">
            Privacy Policy
          </h1>
          <div className="w-12 md:w-16 h-px bg-[#C8A97A] mb-5" />
          <p className="font-ui text-[11px] tracking-[0.1em] uppercase text-[#9A9A9A]">
            Last updated: {LAST_UPDATED}
          </p>
        </header>

        <div className="space-y-10 md:space-y-12">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-ui text-[11px] tracking-[0.2em] uppercase text-[#0A0A0A] mb-4 pb-2 border-b border-[#E0E0E0]">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="font-ui text-sm md:text-[15px] text-[#4A4A4A] leading-[1.8]"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 pl-5 list-disc marker:text-[#C8A97A]">
                    {section.bullets.map((item) => (
                      <li
                        key={item}
                        className="font-ui text-sm md:text-[15px] text-[#4A4A4A] leading-[1.75]"
                      >
                        {item.startsWith("Email:") ? (
                          <>
                            Email:{" "}
                            <a
                              href={`mailto:${CONTACT_EMAIL}`}
                              className="text-[#9A7329] underline underline-offset-2 hover:text-[#0A0A0A] transition-colors"
                            >
                              {CONTACT_EMAIL}
                            </a>
                          </>
                        ) : (
                          item
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-[#E0E0E0] flex flex-col sm:flex-row gap-4">
          <Link
            href="/inquiry"
            className="inline-block font-ui text-[9px] tracking-[0.25em] uppercase px-8 py-3.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300 text-center"
          >
            Contact us
          </Link>
          <Link
            href="/"
            className="inline-block font-ui text-[9px] tracking-[0.25em] uppercase text-[#9A7329] underline underline-offset-4 text-center sm:self-center"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
