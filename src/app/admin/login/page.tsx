import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="px-4 py-6 max-w-md mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-lg font-light text-[#0A0A0A] tracking-widest"
        >
          THE WALK
        </Link>
        <Link
          href="/"
          className="font-ui text-[9px] tracking-[0.25em] uppercase text-[#9A9A9A] hover:text-[#0A0A0A] transition-colors"
        >
          ← Site
        </Link>
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <p className="font-ui text-[9px] tracking-[0.35em] uppercase text-[#C8A97A] mb-8">
            Internal access
          </p>
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
