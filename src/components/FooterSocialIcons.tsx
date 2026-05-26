import type { FooterSocialLink } from "@/config/footer";

const iconClassName =
  "text-white/50 hover:text-[#C8A97A] transition-colors duration-300";

function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case "Instagram":
      return (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "Facebook":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "LinkedIn":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      );
    case "TikTok":
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.16 8.16 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function FooterSocialIcons({
  links,
}: {
  links: FooterSocialLink[];
}) {
  return (
    <div className="flex gap-4 mt-1">
      {links.map((social) => (
        <a
          key={social.label}
          href={social.href}
          data-cursor="link"
          aria-label={social.label}
          className={iconClassName}
          target={social.href.startsWith("http") ? "_blank" : undefined}
          rel={
            social.href.startsWith("http") ? "noopener noreferrer" : undefined
          }
        >
          <SocialIcon label={social.label} />
        </a>
      ))}
    </div>
  );
}
