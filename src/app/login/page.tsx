"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginWithEmail, loginWithGoogle } from "@/app/service/api";
import AuthShell, { GoogleAuthButton } from "@/components/auth/AuthShell";
import { type AuthFormErrors, validateLoginForm } from "@/utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFormErrors>({});
  const [requestError, setRequestError] = useState("");
  const [registrationMessage, setRegistrationMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const error = params.get("auth_error") || params.get("error");
      if (error) {
        window.setTimeout(() => setRequestError(error), 0);
      }
      if (params.get("registered") === "1") {
        window.setTimeout(() => setRegistrationMessage("Akun berhasil dibuat. Silakan masuk untuk melanjutkan."), 0);
      }
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateLoginForm({ email, password });
    setFieldErrors(errors);
    setRequestError("");
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await loginWithEmail(email.trim(), password);
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : "Tidak dapat masuk. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Selamat Datang"
      description="Masuk dengan email atau akun Google kamu."
      visualTitle="Akses Lebih"
      visualAccent="Cepat & Aman."
      visualDescription="Gunakan metode masuk yang paling nyaman. Sesi akunmu tetap dikelola dengan aman oleh server Limbara."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="email" className="text-sm font-bold text-gray-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className="mt-2 h-13 w-full rounded-2xl border-2 border-gray-100 bg-white px-4 text-gray-900 outline-none transition focus:border-green-800 focus:ring-4 focus:ring-green-800/10"
          />
          {fieldErrors.email && <p id="email-error" className="mt-2 text-sm font-medium text-red-700">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="password" className="text-sm font-bold text-gray-700">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? "password-error" : undefined}
            className="mt-2 h-13 w-full rounded-2xl border-2 border-gray-100 bg-white px-4 text-gray-900 outline-none transition focus:border-green-800 focus:ring-4 focus:ring-green-800/10"
          />
          {fieldErrors.password && <p id="password-error" className="mt-2 text-sm font-medium text-red-700">{fieldErrors.password}</p>}
        </div>

        {registrationMessage && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-900" role="status">{registrationMessage}</p>}
        <p className="min-h-5 text-sm font-medium text-red-700" role="alert" aria-live="polite">{requestError}</p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-13 w-full rounded-2xl bg-green-900 px-5 font-bold text-white transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-800/25 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="my-5 text-center text-sm font-medium text-gray-500">Atau</p>
      <GoogleAuthButton onClick={loginWithGoogle} />

      <p className="mt-6 text-center text-sm font-medium text-gray-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-bold text-green-800 hover:text-green-700 focus-visible:outline-none focus-visible:underline">
          Daftar sekarang
        </Link>
      </p>
    </AuthShell>
  );
}
