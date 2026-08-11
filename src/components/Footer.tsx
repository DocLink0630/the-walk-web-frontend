import Link from "next/link";
import FooterLinkColumn from "@/components/FooterLinkColumn";
import FooterSocialIcons from "@/components/FooterSocialIcons";
import {
  DEFAULT_FOOTER_BRAND,
  getFooterCopyright,
  DEFAULT_FOOTER_LEGAL_LINKS,
  DEFAULT_FOOTER_SECTIONS,
  DEFAULT_FOOTER_SOCIAL_CTA,
  DEFAULT_FOOTER_SOCIAL_HANDLE,
  DEFAULT_FOOTER_SOCIAL_LINKS,
  DEFAULT_FOOTER_TAGLINE,
  type FooterLink,
  type FooterSection,
  type FooterSocialLink,
} from "@/config/footer";

export interface FooterProps {
  brand?: string;
  tagline?: string;
  sections?: FooterSection[];
  socialLinks?: FooterSocialLink[];
  socialHandle?: string;
  socialCta?: string;
  copyright?: string;
  legalLinks?: FooterLink[];
  className?: string;
}

const legalLinkClassName =
  "font-ui text-[9px] font-light tracking-[0.25em] uppercase text-white/30 hover:text-white/60 transition-colors duration-300";

export default function Footer({
  brand = DEFAULT_FOOTER_BRAND,
  tagline = DEFAULT_FOOTER_TAGLINE,
  sections = DEFAULT_FOOTER_SECTIONS,
  socialLinks = DEFAULT_FOOTER_SOCIAL_LINKS,
  socialHandle = DEFAULT_FOOTER_SOCIAL_HANDLE,
  socialCta = DEFAULT_FOOTER_SOCIAL_CTA,
  copyright,
  legalLinks = DEFAULT_FOOTER_LEGAL_LINKS,
  className = "",
}: FooterProps) {
  const displayCopyright = copyright ?? getFooterCopyright(brand);

  return (
    <footer
      className={`bg-[#0A0A0A] border-t border-white/10 ${className}`}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 mb-10 md:mb-12">
          <div className="md:col-span-2 lg:col-span-4">
            <h3 className="font-display text-[20px] md:text-[22px] font-light tracking-[0.15em] text-white mb-3 md:mb-4">
              {brand}
            </h3>
            {tagline && (
              <p className="font-display italic text-[14px] font-light text-white/50 leading-[1.7] max-w-[280px]">
                {tagline}
              </p>
            )}
          </div>

          {sections.map((section) => (
            <FooterLinkColumn key={section.title} {...section} />
          ))}

          <div className="lg:col-span-2">
            <p className="font-ui text-[9px] font-light tracking-[0.3em] uppercase text-[#9A9A9A] mb-3 md:mb-4">
              CONNECT
            </p>
            <FooterSocialIcons links={socialLinks} />
            <div className="mt-5 md:mt-6 space-y-1">
              {socialHandle && (
                <p className="font-ui text-[9px] font-light tracking-[0.2em] uppercase text-white/30">
                  {socialHandle}
                </p>
              )}
              {socialCta && (
                <p className="font-display italic text-[13px] font-light text-white/30 leading-[1.6]">
                  {socialCta}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 md:pt-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center md:text-left">
            <p className="font-ui text-[9px] font-light tracking-[0.25em] uppercase text-white/30">
              {displayCopyright}
            </p>
            <p className="font-ui text-[9px] font-light tracking-[0.25em] uppercase text-white/30">
              Powered by{" "}
              <a
                href="https://www.doclinkcare.com/"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="text-white/40 hover:text-white/60 transition-colors duration-300"
              >
                DocLink
              </a>
            </p>
          </div>
          {legalLinks.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-4 sm:gap-6 md:gap-8">
              {legalLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  data-cursor="link"
                  className={legalLinkClassName}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
