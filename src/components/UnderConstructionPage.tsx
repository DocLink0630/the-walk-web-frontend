import Link from "next/link";

interface UnderConstructionPageProps {
  title: string;
  description: string;
}

export default function UnderConstructionPage({
  title,
  description,
}: UnderConstructionPageProps) {
  return (
    <main className="flex-1 min-h-screen bg-white pt-[88px] md:pt-[96px]">
      <section className="flex min-h-[calc(100vh-88px)] md:min-h-[calc(100vh-96px)] items-center justify-center px-4 md:px-8">
        <div className="max-w-[640px] text-center">
          <p className="font-ui text-[9px] md:text-[10px] tracking-[0.35em] uppercase text-[#C8A97A] mb-5 md:mb-6">
            Under Construction
          </p>
          <h1 className="font-display text-[48px] md:text-[72px] lg:text-[88px] font-light text-[#0A0A0A] leading-[0.95] mb-6 md:mb-8">
            {title}
          </h1>
          <div className="w-12 md:w-16 h-px bg-[#C8A97A] mx-auto mb-8 md:mb-10" />
          <p className="font-display text-[16px] md:text-[18px] font-light text-[#4A4A4A] leading-[1.75] mb-10 md:mb-12">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
            <Link
              href="/"
              data-cursor="button"
              className="inline-block font-ui text-[9px] tracking-[0.25em] uppercase px-8 py-3.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300"
            >
              Back to Home
            </Link>
            <Link
              href="/inquiry"
              data-cursor="link"
              className="inline-block font-ui text-[9px] tracking-[0.25em] uppercase text-[#9A7329] underline underline-offset-4"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
