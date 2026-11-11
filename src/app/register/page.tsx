"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginWithGoogle, registerWithEmail } from "@/app/service/api";
import AuthShell, { GoogleAuthButton } from "@/components/auth/AuthShell";
import { type AuthFormErrors, validateRegisterForm } from "@/utils/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFormErrors>({});
  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const error = params.get("auth_error") || params.get("error");
      if (error) {
        window.setTimeout(() => setRequestError(error), 0);
      }
    }
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateRegisterForm({ name, email, password });
    setFieldErrors(errors);
    setRequestError("");
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      await registerWithEmail({ name: name.trim(), email: email.trim(), password });
      router.push("/login?registered=1");
      router.refresh();
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : "Tidak dapat membuat akun. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthShell
      title="Buat Akun"
      description="Daftar untuk menyimpan aktivitas dan menyiapkan tokomu."
      visualTitle="Mulai Berkarya"
      visualAccent="Bersama Limbara."
      visualDescription="Satu akun untuk menyimpan riwayat scan, menemukan karya upcycling, dan membangun tokomu sendiri."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="text-sm font-bold text-gray-700">Nama</label>
          <input
            id="name"
            name="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            autoComplete="name"
            aria-invalid={Boolean(fieldErrors.name)}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className="mt-2 h-13 w-full rounded-2xl border-2 border-gray-100 bg-white px-4 text-gray-900 outline-none transition focus:border-green-800 focus:ring-4 focus:ring-green-800/10"
          />
          {fieldErrors.name && <p id="name-error" className="mt-2 text-sm font-medium text-red-700">{fieldErrors.name}</p>}
        </div>

        <div>
          <label htmlFor="register-email" className="text-sm font-bold text-gray-700">Email</label>
          <input
            id="register-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            inputMode="email"
            aria-invalid={Boolean(fieldErrors.email)}
            aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
            className="mt-2 h-13 w-full rounded-2xl border-2 border-gray-100 bg-white px-4 text-gray-900 outline-none transition focus:border-green-800 focus:ring-4 focus:ring-green-800/10"
          />
          {fieldErrors.email && <p id="register-email-error" className="mt-2 text-sm font-medium text-red-700">{fieldErrors.email}</p>}
        </div>

        <div>
          <label htmlFor="register-password" className="text-sm font-bold text-gray-700">Password</label>
          <input
            id="register-password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            aria-invalid={Boolean(fieldErrors.password)}
            aria-describedby={fieldErrors.password ? "register-password-error" : "register-password-help"}
            className="mt-2 h-13 w-full rounded-2xl border-2 border-gray-100 bg-white px-4 text-gray-900 outline-none transition focus:border-green-800 focus:ring-4 focus:ring-green-800/10"
          />
          {fieldErrors.password ? (
            <p id="register-password-error" className="mt-2 text-sm font-medium text-red-700">{fieldErrors.password}</p>
          ) : (
            <p id="register-password-help" className="mt-2 text-xs font-medium text-gray-500">Gunakan minimal 12 karakter yang sulit ditebak.</p>
          )}
        </div>

        <p className="min-h-5 text-sm font-medium text-red-700" role="alert" aria-live="polite">{requestError}</p>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-13 w-full rounded-2xl bg-green-900 px-5 font-bold text-white transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-800/25 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isSubmitting ? "Memproses..." : "Buat akun"}
        </button>
      </form>

      <p className="my-5 text-center text-sm font-medium text-gray-500">Atau</p>
      <GoogleAuthButton onClick={loginWithGoogle} />

      <p className="mt-6 text-center text-sm font-medium text-gray-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-bold text-green-800 hover:text-green-700 focus-visible:outline-none focus-visible:underline">
          Masuk
        </Link>
      </p>
    </AuthShell>
  );
}
