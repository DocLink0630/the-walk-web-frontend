import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Admin — The Walk",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="admin-app min-h-screen">{children}</div>;
}
