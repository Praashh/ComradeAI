"use client";

import { useSignUp } from "@clerk/nextjs/legacy";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useState,
  useCallback,
  useRef,
  type FormEvent,
  type KeyboardEvent,
  type ClipboardEvent,
} from "react";

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

const OTP_LENGTH = 6;

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  // Step: "form" | "verify"
  const [step, setStep] = useState<"form" | "verify">("form");

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // OTP
  const [otp, setOtp] = useState<string[]>(() => Array.from({ length: OTP_LENGTH }, () => ""));
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ─── Sign-up form submit ─── */
  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!isLoaded || !signUp) return;

      setError("");
      setLoading(true);

      try {
        await signUp.create({
          emailAddress: email,
          password,
        });

        // Send email verification code
        await signUp.prepareEmailAddressVerification({
          strategy: "email_code",
        });

        setStep("verify");
        // Focus first OTP input after the verify step renders
        requestAnimationFrame(() => {
          otpRefs.current[0]?.focus();
        });
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
    [isLoaded, signUp, email, password],
  );

  /* ─── OTP input handlers ─── */
  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return; // digits only
      const next = [...otp];
      next[index] = value.slice(-1); // only last digit
      setOtp(next);

      // Auto-advance
      if (value && index < OTP_LENGTH - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    },
    [otp],
  );

  const handleOtpKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handleOtpPaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
      if (!pasted) return;
      const next = [...otp];
      for (let i = 0; i < OTP_LENGTH; i++) {
        next[i] = pasted[i] ?? "";
      }
      setOtp(next);
      // Focus last filled or last input
      const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
      otpRefs.current[focusIdx]?.focus();
    },
    [otp],
  );

  /* ─── Verify OTP ─── */
  const handleVerify = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!isLoaded || !signUp) return;

      const code = otp.join("");
      if (code.length !== OTP_LENGTH) {
        setError("Please enter the full verification code.");
        return;
      }

      setError("");
      setLoading(true);

      try {
        const result = await signUp.attemptEmailAddressVerification({
          code,
        });

        if (result.status === "complete" && result.createdSessionId) {
          await setActive({ session: result.createdSessionId });
          router.push("/onboarding");
        }
      } catch (err: unknown) {
        const clerkError = err as { errors?: Array<{ longMessage?: string; message?: string }> };
        const message =
          clerkError.errors?.[0]?.longMessage ??
          clerkError.errors?.[0]?.message ??
          "Invalid code. Please try again.";
        setError(message);
      } finally {
        setLoading(false);
      }
    },
    [isLoaded, signUp, otp, setActive, router],
  );

  /* ─── Google OAuth ─── */
  const handleGoogleSignUp = useCallback(async () => {
    if (!isLoaded || !signUp) return;

    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/sign-up/sso-callback",
        redirectUrlComplete: "/onboarding",
      });
    } catch (err: unknown) {
      const clerkError = err as { errors?: Array<{ longMessage?: string; message?: string }> };
      setError(
        clerkError.errors?.[0]?.longMessage ?? "Could not connect to Google.",
      );
    }
  }, [isLoaded, signUp]);

  /* ─── Verify step UI ─── */
  if (step === "verify") {
    return (
      <div className="auth-card">
        <h1 className="auth-heading">Check your email</h1>
        <p className="auth-subheading">
          We sent a 6-digit code to <strong>{email}</strong>
        </p>

        {error && <p className="auth-error">{error}</p>}

        <form onSubmit={handleVerify} className="auth-form">
          <div className="auth-otp-group">
            {otp.map((digit, i) => (
              <input
                key={`otp-digit-${i}`}
                ref={(el) => { otpRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={i}
                className="auth-otp-input"
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(i, e)}
                onPaste={i === 0 ? handleOtpPaste : undefined}
                autoComplete="one-time-code"
                aria-label={`Digit ${i + 1}`}
                id={`otp-${i}`}
              />
            ))}
          </div>

          <button
            type="submit"
            className="auth-btn-primary"
            disabled={loading || !isLoaded}
            id="verify-submit"
          >
            {loading && <span className="auth-spinner" />}
            {loading ? "Verifying…" : "Verify email"}
          </button>
        </form>

        <p className="auth-footer-text">
          Didn&rsquo;t receive a code?{" "}
          <button
            type="button"
            className="auth-link"
            onClick={async () => {
              if (!signUp) return;
              try {
                await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
                setError("");
              } catch {
                setError("Could not resend code. Please try again.");
              }
            }}
          >
            Resend
          </button>
        </p>
      </div>
    );
  }

  /* ─── Sign-up form UI ─── */
  return (
    <div className="auth-card">
      <h1 className="auth-heading">
        Create your account
        <svg
          viewBox="0 0 220 12"
          preserveAspectRatio="none"
          style={{ width: "70%", height: "0.25em", display: "block", marginTop: 4, overflow: "visible" }}
        >
          <path
            className="mark auto"
            d="M3 7 C 50 2, 100 11, 160 5 C 190 3, 210 8, 218 5"
            pathLength={1}
          />
        </svg>
      </h1>
      <p className="auth-subheading">Start your journey with Comrade AI</p>

      {/* Google OAuth */}
      <button
        type="button"
        className="auth-social-btn"
        onClick={handleGoogleSignUp}
        id="sign-up-google"
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
          <label htmlFor="sign-up-email" className="auth-label">
            Email
          </label>
          <input
            id="sign-up-email"
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
          <label htmlFor="sign-up-password" className="auth-label">
            Password
          </label>
          <div className="auth-password-wrap">
            <input
              id="sign-up-password"
              type={showPassword ? "text" : "password"}
              className="auth-input"
              style={{ width: "100%", paddingRight: 42 }}
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
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
          id="sign-up-submit"
        >
          {loading && <span className="auth-spinner" />}
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="auth-footer-text">
        Already have an account?{" "}
        <Link href="/sign-in">Sign in</Link>
      </p>
    </div>
  );
}
