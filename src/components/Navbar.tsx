"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBooking } from "@/context/BookingContext";
import logoImage from "@/assets/images/logo.png";
import LoginModal from "@/components/LoginModal";

const TALENT_LINKS = [
  { href: "/models", label: "Models" },
  { href: "/beauticians", label: "Beauticians" },
  { href: "/photographers", label: "Photographers" },
] as const;

const NAV_LINKS = [
  { href: "/gallery", label: "Gallery" },
  { href: "/events", label: "Events" },
  { href: "/academy", label: "Academy" },
  { href: "/about", label: "About" },
] as const;

const desktopLinkClass =
  "font-ui text-[10px] font-light tracking-[0.25em] uppercase hover:text-[#C8A97A] transition-colors duration-300";

const talentDropdownLinkClass =
  "block font-ui text-[10px] font-light tracking-[0.25em] uppercase px-7 py-4 hover:bg-[#F9F9F9] hover:text-[#C8A97A] transition-colors duration-300 border-b border-[#F0F0F0] last:border-0";

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, logout, user, isModel, isClient } = useAuth();
  const { bookingCart } = useBooking();
  const [showLogin, setShowLogin] = useState(false);
  const [showTalentMenu, setShowTalentMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTalentOpen, setMobileTalentOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (isAuthenticated || typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("login") === "1") {
      setShowLogin(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const animation = gsap.from(nav, {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      delay: 0.5,
    });

    return () => {
      animation.kill();
    };
  }, []);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const updateHeight = () => setHeaderHeight(header.offsetHeight);
    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(header);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMobileMenu();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileTalentOpen(false);
  };

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-[#E0E0E0]"
      >
        <div
          ref={headerRef}
          className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[80px]"
        >
          <div className="flex items-center justify-between gap-4 py-4 md:py-5">
            <Link
              href="/"
              data-cursor="link"
              className="hover:opacity-70 transition-opacity duration-300 shrink-0 z-10"
              onClick={closeMobileMenu}
            >
              <Image
                src={logoImage}
                alt="The Walk Model Academy"
                className="h-7 md:h-9 w-auto"
                priority
              />
            </Link>

            <ul className="hidden lg:flex items-center gap-9">
              <li
                className="relative group"
                onMouseEnter={() => setShowTalentMenu(true)}
                onMouseLeave={() => setShowTalentMenu(false)}
              >
                <button
                  type="button"
                  data-cursor="link"
                  className={`${desktopLinkClass} py-2`}
                  aria-expanded={showTalentMenu}
                  aria-haspopup="true"
                >
                  TALENT
                </button>
                {showTalentMenu && (
                  <div className="absolute top-full left-0 pt-2 z-[110]">
                    <div className="bg-white border border-[#E0E0E0] min-w-[220px] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                      {TALENT_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          data-cursor="link"
                          className={talentDropdownLinkClass}
                        >
                          {link.label.toUpperCase()}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    data-cursor="link"
                    className={desktopLinkClass}
                  >
                    {link.label.toUpperCase()}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="hidden lg:flex items-center gap-6">
              {isAuthenticated && (
                <>
                  <Link
                    href="/inquiry"
                    data-cursor="button"
                    className={`relative ${desktopLinkClass}`}
                  >
                    INQUIRY
                    {bookingCart.length > 0 && (
                      <span className="absolute -top-1.5 -right-2 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-[#C8A97A] text-white font-ui text-[8px] tracking-[0.1em]">
                        {bookingCart.length}
                      </span>
                    )}
                  </Link>
                  <div className="w-px h-4 bg-[#E0E0E0]" />
                </>
              )}

              {isAuthenticated ? (
                <>
                  {isModel && (
                    <Link
                      href="/model/profile"
                      data-cursor="button"
                      title={user?.name}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A0A0A] text-white font-ui text-[9px] tracking-widest hover:bg-[#C8A97A] transition-colors shrink-0"
                    >
                      {(user?.name ?? "M")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </Link>
                  )}
                  {isClient && !isModel && (
                    <Link
                      href="/client/profile"
                      data-cursor="button"
                      title={user?.name}
                      className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0A0A0A] text-white font-ui text-[9px] tracking-widest hover:bg-[#C8A97A] transition-colors shrink-0"
                    >
                      {(user?.name ?? "C")
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    data-cursor="button"
                    className={desktopLinkClass}
                  >
                    LOGOUT
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowLogin(true)}
                  data-cursor="button"
                  className={desktopLinkClass}
                >
                  LOGIN
                </button>
              )}

              <Link
                href="/register"
                data-cursor="button"
                className="font-ui text-[10px] font-light tracking-[0.25em] uppercase px-6 py-2.5 bg-[#0A0A0A] text-white hover:bg-[#C8A97A] transition-colors duration-300"
              >
                APPLY
              </Link>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="lg:hidden w-11 h-11 -mr-1 flex items-center justify-center text-[#0A0A0A] hover:text-[#C8A97A] transition-colors duration-300 z-[101]"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileMenuOpen ? (
                <X size={22} strokeWidth={1.5} />
              ) : (
                <Menu size={22} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            className="lg:hidden fixed inset-0 z-[98] bg-[#0A0A0A]/40 backdrop-blur-[2px]"
            style={{ top: headerHeight }}
            onClick={closeMobileMenu}
            aria-label="Close menu"
          />

          <div
            id="mobile-nav-panel"
            className="lg:hidden fixed right-0 z-[99] flex w-full max-w-[360px] flex-col border-l border-[#E0E0E0] bg-white shadow-[-8px_0_30px_rgba(0,0,0,0.08)]"
            style={{
              top: headerHeight,
              height: `calc(100dvh - ${headerHeight}px)`,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
          >
            <nav className="flex-1 overflow-y-auto overscroll-contain px-5 py-6 pb-8">
              <p className="font-ui text-[8px] font-light tracking-[0.35em] uppercase text-[#9A9A9A] mb-4">
                Menu
              </p>

              <div className="border-b border-[#E0E0E0]">
                <button
                  type="button"
                  onClick={() => setMobileTalentOpen((open) => !open)}
                  className="flex w-full min-h-[52px] items-center justify-between py-3 font-ui text-[11px] font-light tracking-[0.25em] uppercase text-[#0A0A0A] hover:text-[#C8A97A] transition-colors duration-300"
                  aria-expanded={mobileTalentOpen}
                  aria-controls="mobile-talent-submenu"
                >
                  Talent
                  <ChevronDown
                    size={16}
                    strokeWidth={1.5}
                    className={`shrink-0 transition-transform duration-300 ${mobileTalentOpen ? "rotate-180 text-[#C8A97A]" : "text-[#9A9A9A]"}`}
                  />
                </button>

                <div
                  id="mobile-talent-submenu"
                  className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${mobileTalentOpen ? "grid-rows-[1fr] opacity-100 pb-3" : "grid-rows-[0fr] opacity-0"}`}
                >
                  <div className="overflow-hidden">
                    <div className="ml-1 space-y-1 border-l border-[#E0E0E0] pl-4">
                      {TALENT_LINKS.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={closeMobileMenu}
                          className="flex min-h-[44px] items-center font-ui text-[10px] font-light tracking-[0.22em] uppercase text-[#4A4A4A] hover:text-[#C8A97A] transition-colors duration-300"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="flex min-h-[52px] items-center border-b border-[#E0E0E0] font-ui text-[11px] font-light tracking-[0.25em] uppercase text-[#0A0A0A] hover:text-[#C8A97A] transition-colors duration-300"
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  href="/inquiry"
                  onClick={closeMobileMenu}
                  className="flex min-h-[52px] items-center justify-between border-b border-[#E0E0E0] font-ui text-[11px] font-light tracking-[0.25em] uppercase text-[#C8A97A]"
                >
                  Inquiry
                  {bookingCart.length > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center bg-[#C8A97A] px-1.5 font-ui text-[8px] tracking-[0.1em] text-white">
                      {bookingCart.length}
                    </span>
                  )}
                </Link>
              )}
            </nav>

            <div className="shrink-0 border-t border-[#E0E0E0] bg-[#FAFAFA] px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] space-y-3">
              {isAuthenticated && isModel && (
                <Link
                  href="/model/profile"
                  onClick={closeMobileMenu}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 border border-[#C8A97A] bg-[#C8A97A]/10 font-ui text-[10px] font-light tracking-[0.25em] uppercase text-[#9A7329]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C8A97A] text-white text-[8px]">
                    {(user?.name ?? "M")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                  My profile
                </Link>
              )}
              {isAuthenticated && isClient && !isModel && (
                <Link
                  href="/client/profile"
                  onClick={closeMobileMenu}
                  className="flex min-h-[48px] w-full items-center justify-center gap-2 border border-[#C8A97A] bg-[#C8A97A]/10 font-ui text-[10px] font-light tracking-[0.25em] uppercase text-[#9A7329]"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C8A97A] text-white text-[8px]">
                    {(user?.name ?? "C")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </span>
                  My profile
                </Link>
              )}
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="flex min-h-[48px] w-full items-center justify-center border border-[#E0E0E0] bg-white font-ui text-[10px] font-light tracking-[0.25em] uppercase text-[#0A0A0A] hover:border-[#C8A97A] hover:text-[#C8A97A] transition-colors duration-300"
                >
                  Logout
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowLogin(true);
                    closeMobileMenu();
                  }}
                  className="flex min-h-[48px] w-full items-center justify-center border border-[#E0E0E0] bg-white font-ui text-[10px] font-light tracking-[0.25em] uppercase text-[#0A0A0A] hover:border-[#C8A97A] hover:text-[#C8A97A] transition-colors duration-300"
                >
                  Login
                </button>
              )}

              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="flex min-h-[48px] w-full items-center justify-center bg-[#0A0A0A] font-ui text-[10px] font-light tracking-[0.25em] uppercase text-white hover:bg-[#C8A97A] transition-colors duration-300"
              >
                Apply
              </Link>
            </div>
          </div>
        </>
      )}

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
