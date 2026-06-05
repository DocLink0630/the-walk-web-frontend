/**
 * Registration uses the global Navbar from Providers (not hidden).
 * Top padding clears the fixed header.
 */
export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex-1 w-full bg-[#FAFAFA] pt-[88px] md:pt-[96px] pb-16">
      {children}
    </main>
  );
}
