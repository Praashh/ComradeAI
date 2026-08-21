"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return (
    <div className="auth-card flex flex-col items-center justify-center py-12 text-center">
      <span className="auth-spinner mb-4 !h-6 !w-6" style={{ margin: "0 0 16px 0" }} />
      <p className="auth-subheading" style={{ margin: 0 }}>
        Completing sign up…
      </p>
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
