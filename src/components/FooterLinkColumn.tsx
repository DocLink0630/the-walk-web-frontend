import Link from "next/link";
import type { FooterSection } from "@/config/footer";

const linkClassName =
  "font-display text-[14px] font-light text-white/70 hover:text-[#C8A97A] transition-colors duration-300";

export default function FooterLinkColumn({ title, links }: FooterSection) {
  return (
    <div className="lg:col-span-2">
      <p className="font-ui text-[9px] font-light tracking-[0.3em] uppercase text-[#9A9A9A] mb-3 md:mb-4">
        {title}
      </p>
      <ul className="space-y-2">
        {links.map((item) => (
          <li key={item.label}>
            <Link
              href={item.href}
              data-cursor="link"
              className={linkClassName}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
