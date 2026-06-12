import Link from "next/link";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="auth-page">
      <Link href="/" className="auth-logo">
        Mira<span className="dot">.</span>
      </Link>
      {children}
    </div>
  );
}
