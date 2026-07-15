import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign Up - Comrade AI",
  description:
    "Create your Comrade AI account and start journaling with your AI companion.",
};

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="auth-page landing-theme">
      <Link href="/" className="auth-logo">
        ComradeAI
      </Link>
      {children}
    </div>
  );
}
