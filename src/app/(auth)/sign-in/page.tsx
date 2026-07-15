"use client";

import { useSignIn } from "@clerk/nextjs/legacy";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, type FormEvent } from "react";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    </svg>
  );
}

export default function SignInPage() {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!isLoaded || !signIn) return;

      setError("");
      setLoading(true);

      try {
        const result = await signIn.create({
          identifier: email,
          password,
        });

        if (result.status === "complete" && result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          router.push("/chat");
        }
      } catch (err: unknown) {
        const clerkError = err as { errors?: Array<{ longMessage?: string; message?: string }> };
        const message =
          clerkError.errors?.[0]?.longMessage ??
          clerkError.errors?.[0]?.message ??
          "Something went wrong. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [isLoaded, signIn, email, password, setActive, router],
  );

  const handleGoogleSignIn = useCallback(async () => {
    if (!isLoaded || !signIn) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sign-in/sso-callback",
        redirectUrlComplete: "/chat",
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ longMessage?: string; message?: string }> };
      setError(
        clerkError.errors?.[0]?.longMessage ?? "Could not connect to Google.",
      );
    }
  }, [isLoaded, signIn]);

  return (
    <div className="auth-card">
      <h1 className="auth-heading">Welcome back</h1>
      <p className="auth-subheading">Sign in to continue to Comrade AI</p>

      {/* Google OAuth */}
      <button
        type="button"
        className="auth-social-btn"
        onClick={handleGoogleSignIn}
        id="sign-in-google"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="auth-divider">
        <span>or continue with email</span>
      </div>

      {/* Error */}
      {error && <p className="auth-error">{error}</p>}

      {/* Email + Password form */}
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="sign-in-email" className="auth-label">
            Email
          </label>
          <input
            id="sign-in-email"
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-field">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <label htmlFor="sign-in-password" className="auth-label">
              Password
            </label>
          </div>
          <div className="auth-password-wrap">
            <input
              id="sign-in-password"
              type={showPassword ? "text" : "password"}
              className="auth-input"
              style={{ width: "100%", paddingRight: 42 }}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <button
              type="button"
              className="auth-password-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="auth-btn-primary"
          disabled={loading || !isLoaded}
          id="sign-in-submit"
        >
          {loading && <span className="auth-spinner" />}
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="auth-footer-text">
        Don&rsquo;t have an account?{" "}
        <Link href="/sign-up">Start writing</Link>
      </p>
    </div>
  );
}
