"use client"
import React, { useMemo, useRef, useState } from "react";

type ExperienceLevel = "Fresher" | "1-3" | "3-5" | "5-8" | "8+";
type NoticePeriod = "Immediate" | "15 days" | "30 days" | "60 days" | "90 days+";

type FormState = {
  fullName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  experience: ExperienceLevel;
  currentLocation: string;
  highestQualification: string;
  currentRole: string;
  noticePeriod: NoticePeriod;
  expectedCtc: string;
  resumeFileName: string;
  consent: boolean;
};

type Errors = Partial<Record<keyof FormState, string>> & { skills?: string };

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isMobile(value: string) {
  return /^[0-9]{10}$/.test(value.trim());
}

function sanitizeNumber(value: string) {
  return value.replace(/[^\d]/g, "");
}

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [skills, setSkills] = useState<string[]>([]);
  const [skillDraft, setSkillDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    experience: "Fresher",
    currentLocation: "",
    highestQualification: "",
    currentRole: "",
    noticePeriod: "Immediate",
    expectedCtc: "",
    resumeFileName: "",
    consent: false,
  });

  const [errors, setErrors] = useState<Errors>({});

  const headerText = useMemo(() => {
    return "Create your profile";
  }, []);

  const subText = useMemo(() => {
    return "Register to apply faster, get job alerts, and track applications.";
  }, []);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addSkillFromDraft() {
    const value = skillDraft.trim();
    if (!value) return;

    const normalized = value.toLowerCase();
    const alreadyExists = skills.some((s) => s.toLowerCase() === normalized);
    if (alreadyExists) {
      setSkillDraft("");
      return;
    }

    setSkills((prev) => [...prev, value]);
    setSkillDraft("");
  }

  function removeSkill(skill: string) {
    setSkills((prev) => prev.filter((s) => s !== skill));
  }

  function onSkillKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkillFromDraft();
    }
    if (e.key === "Backspace" && !skillDraft && skills.length) {
      removeSkill(skills[skills.length - 1]);
    }
  }

  function onPickResume() {
    fileInputRef.current?.click();
  }

  function onResumeSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      onChange("resumeFileName", "");
      return;
    }
    onChange("resumeFileName", file.name);
  }

  function validate(): Errors {
    const next: Errors = {};

    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!isEmail(form.email)) next.email = "Enter a valid email address.";

    if (!form.mobile.trim()) next.mobile = "Mobile number is required.";
    else if (!isMobile(form.mobile)) next.mobile = "Enter a valid 10-digit mobile number.";

    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 8) next.password = "Password must be at least 8 characters.";

    if (!form.confirmPassword) next.confirmPassword = "Please confirm your password.";
    else if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match.";

    if (!form.currentLocation.trim()) next.currentLocation = "Current location is required.";
    if (!form.highestQualification.trim()) next.highestQualification = "Highest qualification is required.";

    if (!form.currentRole.trim() && form.experience !== "Fresher") {
      next.currentRole = "Current role is required for experienced profiles.";
    }

    const expected = form.expectedCtc.trim();
    if (expected && !/^\d+(\.\d+)?$/.test(expected)) {
      next.expectedCtc = "Expected CTC must be a number (example: 8 or 8.5).";
    }

    if (skills.length === 0) next.skills = "Add at least one skill.";

    if (!form.resumeFileName) next.resumeFileName = "Please upload your resume.";

    if (!form.consent) next.consent = "You must accept the terms to continue.";

    return next;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const next = validate();
    setErrors(next);

    const hasErrors = Object.values(next).some(Boolean);
    if (hasErrors) return;

    try {
      setIsSubmitting(true);

      // Replace with your API call
      await new Promise((r) => setTimeout(r, 900));

      alert("Registration successful. Profile created.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function goToSignIn() {
    // Replace with navigation to your login route
    alert("Navigate to Sign in page");
  }

  return (
    <div className="regShell">
      <div className="regGrid">
        <aside className="regBrand">
          <div className="brandTop">
            <div className="brandMark" aria-hidden="true">J</div>
            <div>
              <div className="brandName">JobSphere</div>
              <div className="brandTag">Your next role starts here</div>
            </div>
          </div>

          <div className="brandBody">
            <h2 className="brandHeading">Build your profile in minutes</h2>
            <p className="brandCopy">
              Add key details like skills, location, experience and resume.
              Recruiters can discover your profile faster.
            </p>

            <ul className="brandList">
              <li>Job alerts based on your skills</li>
              <li>One-click apply to relevant roles</li>
              <li>Track applications and interview status</li>
            </ul>
          </div>

          <div className="brandFooter">
            <span className="brandFootNote">
              Tip: Keep your resume updated for better visibility.
            </span>
          </div>
        </aside>

        <main className="regMain">
          <div className="regCard" role="region" aria-label="Registration">
            <div className="cardHeader">
              <h1 className="cardTitle">{headerText}</h1>
              <p className="cardSubtitle">{subText}</p>
            </div>

            <form className="regForm" onSubmit={onSubmit} noValidate>
              <div className="row2">
                <div className="field">
                  <div className={`inputWrap ${errors.fullName ? "hasError" : ""}`}>
                    <input
                      id="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => onChange("fullName", e.target.value)}
                      placeholder=" "
                      autoComplete="name"
                      aria-invalid={Boolean(errors.fullName)}
                    />
                    <label htmlFor="fullName">Full name</label>
                  </div>
                  {errors.fullName ? <div className="errorText">{errors.fullName}</div> : null}
                </div>

                <div className="field">
                  <div className={`inputWrap ${errors.email ? "hasError" : ""}`}>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => onChange("email", e.target.value)}
                      placeholder=" "
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                    />
                    <label htmlFor="email">Email</label>
                  </div>
                  {errors.email ? <div className="errorText">{errors.email}</div> : null}
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <div className={`inputWrap ${errors.mobile ? "hasError" : ""}`}>
                    <input
                      id="mobile"
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => onChange("mobile", sanitizeNumber(e.target.value) as any)}
                      placeholder=" "
                      inputMode="numeric"
                      autoComplete="tel"
                      aria-invalid={Boolean(errors.mobile)}
                    />
                    <label htmlFor="mobile">Mobile (10 digits)</label>
                  </div>
                  {errors.mobile ? <div className="errorText">{errors.mobile}</div> : null}
                </div>

                <div className="field">
                  <div className="selectWrap">
                    <label className="selectLabel" htmlFor="experience">Experience</label>
                    <select
                      id="experience"
                      value={form.experience}
                      onChange={(e) => onChange("experience", e.target.value as ExperienceLevel)}
                      className="selectControl"
                    >
                      <option value="Fresher">Fresher</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-8">5-8 years</option>
                      <option value="8+">8+ years</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <div className={`inputWrap ${errors.password ? "hasError" : ""}`}>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={(e) => onChange("password", e.target.value)}
                      placeholder=" "
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.password)}
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
                  {errors.password ? <div className="errorText">{errors.password}</div> : null}
                </div>

                <div className="field">
                  <div className={`inputWrap ${errors.confirmPassword ? "hasError" : ""}`}>
                    <input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={form.confirmPassword}
                      onChange={(e) => onChange("confirmPassword", e.target.value)}
                      placeholder=" "
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.confirmPassword)}
                    />
                    <label htmlFor="confirmPassword">Confirm password</label>
                  </div>
                  {errors.confirmPassword ? (
                    <div className="errorText">{errors.confirmPassword}</div>
                  ) : null}
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <div className={`inputWrap ${errors.currentLocation ? "hasError" : ""}`}>
                    <input
                      id="currentLocation"
                      type="text"
                      value={form.currentLocation}
                      onChange={(e) => onChange("currentLocation", e.target.value)}
                      placeholder=" "
                      aria-invalid={Boolean(errors.currentLocation)}
                    />
                    <label htmlFor="currentLocation">Current location</label>
                  </div>
                  {errors.currentLocation ? (
                    <div className="errorText">{errors.currentLocation}</div>
                  ) : null}
                </div>

                <div className="field">
                  <div className={`inputWrap ${errors.highestQualification ? "hasError" : ""}`}>
                    <input
                      id="highestQualification"
                      type="text"
                      value={form.highestQualification}
                      onChange={(e) => onChange("highestQualification", e.target.value)}
                      placeholder=" "
                      aria-invalid={Boolean(errors.highestQualification)}
                    />
                    <label htmlFor="highestQualification">Highest qualification</label>
                  </div>
                  {errors.highestQualification ? (
                    <div className="errorText">{errors.highestQualification}</div>
                  ) : null}
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <div className={`inputWrap ${errors.currentRole ? "hasError" : ""}`}>
                    <input
                      id="currentRole"
                      type="text"
                      value={form.currentRole}
                      onChange={(e) => onChange("currentRole", e.target.value)}
                      placeholder=" "
                      aria-invalid={Boolean(errors.currentRole)}
                    />
                    <label htmlFor="currentRole">Current role (if experienced)</label>
                  </div>
                  {errors.currentRole ? <div className="errorText">{errors.currentRole}</div> : null}
                </div>

                <div className="field">
                  <div className="selectWrap">
                    <label className="selectLabel" htmlFor="noticePeriod">Notice period</label>
                    <select
                      id="noticePeriod"
                      value={form.noticePeriod}
                      onChange={(e) => onChange("noticePeriod", e.target.value as NoticePeriod)}
                      className="selectControl"
                    >
                      <option value="Immediate">Immediate</option>
                      <option value="15 days">15 days</option>
                      <option value="30 days">30 days</option>
                      <option value="60 days">60 days</option>
                      <option value="90 days+">90 days+</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="row2">
                <div className="field">
                  <div className={`inputWrap ${errors.expectedCtc ? "hasError" : ""}`}>
                    <input
                      id="expectedCtc"
                      type="text"
                      value={form.expectedCtc}
                      onChange={(e) => onChange("expectedCtc", e.target.value)}
                      placeholder=" "
                      aria-invalid={Boolean(errors.expectedCtc)}
                    />
                    <label htmlFor="expectedCtc">Expected CTC (LPA, optional)</label>
                  </div>
                  {errors.expectedCtc ? <div className="errorText">{errors.expectedCtc}</div> : null}
                </div>

                <div className="field">
                  <div className={`uploadWrap ${errors.resumeFileName ? "hasError" : ""}`}>
                    <div className="uploadInfo">
                      <div className="uploadTitle">Resume</div>
                      <div className="uploadSub">
                        {form.resumeFileName ? form.resumeFileName : "PDF/DOC, up to your limit"}
                      </div>
                    </div>
                    <button type="button" className="uploadBtn" onClick={onPickResume}>
                      Upload
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="fileInput"
                      onChange={onResumeSelected}
                    />
                  </div>
                  {errors.resumeFileName ? (
                    <div className="errorText">{errors.resumeFileName}</div>
                  ) : null}
                </div>
              </div>

              <div className="field">
                <div className={`skillsWrap ${errors.skills ? "hasError" : ""}`}>
                  <div className="skillsHeader">
                    <span className="skillsTitle">Skills</span>
                    <span className="skillsHint">Press Enter or comma to add</span>
                  </div>

                  <div className="skillsBox">
                    {skills.map((s) => (
                      <button
                        type="button"
                        key={s}
                        className="skillPill"
                        onClick={() => removeSkill(s)}
                        aria-label={`Remove ${s}`}
                      >
                        {s}
                        <span className="pillX" aria-hidden="true">×</span>
                      </button>
                    ))}

                    <input
                      type="text"
                      value={skillDraft}
                      onChange={(e) => setSkillDraft(e.target.value)}
                      onKeyDown={onSkillKeyDown}
                      placeholder={skills.length ? "" : "Example: React, TypeScript, Pega"}
                      className="skillsInput"
                    />
                  </div>
                </div>

                {errors.skills ? <div className="errorText">{errors.skills}</div> : null}
              </div>

              <div className="field">
                <label className="checkRow">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(e) => onChange("consent", e.target.checked)}
                  />
                  <span>
                    I agree to the Terms and Privacy Policy and allow recruiters to contact me.
                  </span>
                </label>
                {errors.consent ? <div className="errorText">{errors.consent}</div> : null}
              </div>

              <button type="submit" className="primaryBtn" disabled={isSubmitting}>
                {isSubmitting ? "Creating profile..." : "Create profile"}
              </button>

              <button type="button" className="secondaryBtn" onClick={goToSignIn}>
                Already have an account? Sign in
              </button>

              <p className="finePrint">
                Tip: Use a strong password and keep your skills aligned to your target roles.
              </p>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
