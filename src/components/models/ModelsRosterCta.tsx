import Link from "next/link";

export default function ModelsRosterCta() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#C8A97A] border-t border-[#0A0A0A]/10">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px] py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="font-ui text-[9px] tracking-[0.3em] uppercase text-[#0A0A0A] mb-1">
            ARE YOU A MODEL?
          </p>
          <p className="font-display italic text-[15px] md:text-[16px] text-[#0A0A0A]/80">
            Join our roster and connect with top clients.
          </p>
        </div>
        <Link
          href="/register/model"
          data-cursor="button"
          className="font-ui text-[9px] tracking-[0.3em] uppercase px-8 py-3 bg-[#0A0A0A] text-white hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300 text-center shrink-0"
        >
          Join Our Roster
        </Link>
      </div>
    </div>
  );
}
