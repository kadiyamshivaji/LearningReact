"use client"
import React, { useMemo, useState } from "react";
import { useRouter } from 'next/navigation';

import "./login.css";

type Mode = "signin" | "signup";

type FormState = {
  username: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function Home() {
     const router = useRouter()
  
  const [mode, setMode] = useState<Mode>("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState<FormState>({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const title = mode === "signin" ? "Welcome back" : "Create your account";
  const subtitle =
    mode === "signin"
      ? "Sign in to continue"
      : "Sign up to get started";

  const primaryButtonText = mode === "signin" ? "Sign in" : "Sign up";

  const helperText = useMemo(() => {
    return mode === "signin"
      ? "New here? Create an account"
      : "Already have an account? Sign in";
  }, [mode]);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): FormErrors {
    const errors: FormErrors = {};

    const username = form.username.trim();
    if (!username) {
      errors.username = "Username is required.";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters.";
    }

    if (!form.password) {
      errors.password = "Password is required.";
    } else if (form.password.length < 8) {
      errors.password = "Password must be at least 8 characters.";
    }

    if (mode === "signup") {
      if (!form.confirmPassword) {
        errors.confirmPassword = "Please confirm your password.";
      } else if (form.confirmPassword !== form.password) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    return errors;
  }

  const [errors, setErrors] = useState<FormErrors>({});

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors = validate();
    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some(Boolean);
    if (hasErrors) return;

    try {
      setIsSubmitting(true);

      // Replace this with your API call
      await new Promise((r) => setTimeout(r, 900));

      alert(
        mode === "signin"
          ? `Signed in as ${form.username}`
          : `Account created for ${form.username}`
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleMode() {
    setErrors({});
    
  }

  return (
    <div className="authShell">
      <div className="authGrid">
        <aside className="authBrand">
          <div className="brandTop">
            <div className="brandMark" aria-hidden="true">
              A
            </div>
            <div>
              <div className="brandName">Aster Portal</div>
              <div className="brandTag">Secure access for your workspace</div>
            </div>
          </div>

          <div className="brandBody">
            <h2 className="brandHeading">Fast. Clean. Modern.</h2>
            <p className="brandCopy">
              This login screen is a lightweight starter you can customize for
              your product. It includes validation, sign-in and sign-up modes,
              and accessible form controls.
            </p>

            <ul className="brandList">
              <li>Type-safe React + TSX</li>
              <li>Pure CSS with fancy gradients</li>
              <li>Responsive layout</li>
            </ul>
          </div>

          <div className="brandFooter">
            <span className="brandFootNote">
              Tip: Replace the placeholder alert with your API call.
            </span>
          </div>
        </aside>

        <main className="authMain">
          <div className="authCard" role="region" aria-label="Authentication">
            <div className="cardHeader">
              <h1 className="cardTitle">{title}</h1>
              <p className="cardSubtitle">{subtitle}</p>
            </div>

            <form className="authForm" onSubmit={onSubmit} noValidate>
              <div className="field">
                <div className={`inputWrap ${errors.username ? "hasError" : ""}`}>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    value={form.username}
                    onChange={(e) => onChange("username", e.target.value)}
                    placeholder=" "
                    aria-invalid={Boolean(errors.username)}
                    aria-describedby={errors.username ? "usernameError" : undefined}
                  />
                  <label htmlFor="username">Username</label>
                </div>
                {errors.username ? (
                  <div className="errorText" id="usernameError">
                    {errors.username}
                  </div>
                ) : null}
              </div>

              <div className="field">
                <div className={`inputWrap ${errors.password ? "hasError" : ""}`}>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={form.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    placeholder=" "
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "passwordError" : undefined}
                  />
                  <label htmlFor="password">Password</label>

                  <button
                    type="button"
                    className="toggleBtn"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password ? (
                  <div className="errorText" id="passwordError">
                    {errors.password}
                  </div>
                ) : null}
              </div>

              {mode === "signup" ? (
                <div className="field">
                  <div
                    className={`inputWrap ${errors.confirmPassword ? "hasError" : ""}`}
                  >
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={form.confirmPassword}
                      onChange={(e) => onChange("confirmPassword", e.target.value)}
                      placeholder=" "
                      aria-invalid={Boolean(errors.confirmPassword)}
                      aria-describedby={
                        errors.confirmPassword ? "confirmPasswordError" : undefined
                      }
                    />
                    <label htmlFor="confirmPassword">Confirm password</label>
                  </div>
                  {errors.confirmPassword ? (
                    <div className="errorText" id="confirmPasswordError">
                      {errors.confirmPassword}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <button
                type="submit"
                className="primaryBtn"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Please wait..." : primaryButtonText}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <button type="button" className="secondaryBtn" onClick={() => router.push('/registration')}>
                {helperText}
              </button>

              <p className="finePrint">
                By continuing, you agree to the Terms and acknowledge the Privacy Policy.
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
