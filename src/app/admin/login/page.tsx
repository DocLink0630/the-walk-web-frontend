import Link from "next/link";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center px-4 py-10 bg-gray-100">
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-amber-600">
          The Walk
        </Link>
        <Link href="/" className="text-sm text-gray-500 hover:text-gray-900">
          Back to site
        </Link>
      </div>
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 shadow-sm">
        <AdminLoginForm />
      </div>
    </div>
  );
}
