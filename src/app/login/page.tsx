"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginWithEmail, loginWithGoogle, registerWithEmail } from "@/app/service/api";
import { type AuthFormErrors, type AuthMode, validateAuthForm } from "@/utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<AuthFormErrors>({});
  const [requestError, setRequestError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setPassword("");
    setFieldErrors({});
    setRequestError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors = validateAuthForm(mode, { email, name, password });
    setFieldErrors(errors);
    setRequestError("");
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    try {
      if (mode === "register") {
        await registerWithEmail({ email: email.trim(), name: name.trim(), password });
      } else {
        await loginWithEmail(email.trim(), password);
      }
      router.push("/");
      router.refresh();
    } catch (error: unknown) {
      setRequestError(error instanceof Error ? error.message : "Autentikasi gagal. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-dvh place-items-center bg-[#F7F8F4] px-4 py-6 sm:px-8 lg:py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white lg:min-h-[680px] lg:grid-cols-2">
        <section className="flex flex-col justify-center px-6 py-8 sm:px-12 sm:py-12 lg:px-16" aria-labelledby="auth-title">
          <div>
            <Link href="/" className="inline-block rounded-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/25">
              <Image
                src="/img/logo/limbara.png"
                alt="Limbara"
                width={144}
                height={48}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>

            <h1 id="auth-title" className="mt-10 text-3xl font-black tracking-[-0.035em] text-gray-950">
              {mode === "login" ? "Masuk ke Limbara" : "Buat akun Limbara"}
            </h1>
            <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
              {mode === "login"
                ? "Lanjutkan perjalananmu mengubah material terbuang menjadi karya bernilai."
                : "Daftar dengan email atau gunakan Google untuk mulai berkarya bersama Limbara."}
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 border-b border-gray-200" role="tablist" aria-label="Pilih metode autentikasi">
            {(["login", "register"] as const).map((item) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={mode === item}
                aria-controls="auth-form"
                onClick={() => changeMode(item)}
                className={`h-11 border-b-2 text-sm font-bold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/20 ${
                  mode === item ? "border-green-800 text-green-900" : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {item === "login" ? "Masuk" : "Daftar"}
              </button>
            ))}
          </div>

          <form id="auth-form" onSubmit={handleSubmit} className="mt-7 space-y-4" noValidate>
            {mode === "register" && (
              <div>
                <label htmlFor="name" className="text-sm font-semibold text-gray-800">Nama</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  autoComplete="name"
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  className="mt-2 h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-950 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
                />
                {fieldErrors.name && <p id="name-error" className="mt-2 text-sm text-red-700">{fieldErrors.name}</p>}
              </div>
            )}

            <div>
              <label htmlFor="email" className="text-sm font-semibold text-gray-800">Email</label>
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
                className="mt-2 h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-950 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
              />
              {fieldErrors.email && <p id="email-error" className="mt-2 text-sm text-red-700">{fieldErrors.email}</p>}
            </div>

            <div>
              <label htmlFor="password" className="text-sm font-semibold text-gray-800">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={fieldErrors.password ? "password-error" : mode === "register" ? "password-help" : undefined}
                className="mt-2 h-12 w-full rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-950 outline-none transition focus:border-green-700 focus:ring-4 focus:ring-green-700/10"
              />
              {fieldErrors.password ? (
                <p id="password-error" className="mt-2 text-sm text-red-700">{fieldErrors.password}</p>
              ) : mode === "register" ? (
                <p id="password-help" className="mt-2 text-xs text-gray-600">Gunakan minimal 10 karakter.</p>
              ) : null}
            </div>

            <p className="min-h-6 text-sm text-red-700" role="alert" aria-live="polite">{requestError}</p>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-full bg-green-900 px-6 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/25"
            >
              {isSubmitting ? "Memproses..." : mode === "login" ? "Masuk" : "Buat akun"}
            </button>
          </form>

          <div className="mt-6">
            <p className="mb-3 text-center text-sm text-gray-600">Atau lanjutkan dengan Google</p>
            <button
              onClick={loginWithGoogle}
              type="button"
              className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-5 text-sm font-bold text-gray-800 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-700/20"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-gray-500">
            Dengan melanjutkan, kamu menyetujui ketentuan layanan dan kebijakan privasi Limbara.
          </p>
        </section>

        <aside className="relative hidden overflow-hidden bg-green-950 p-12 lg:flex lg:flex-col lg:justify-between" aria-label="Tentang akun Limbara">
          <div className="max-w-sm">
            <h2 className="text-3xl font-black leading-tight tracking-[-0.035em] text-white">Satu akun untuk karya yang terus hidup.</h2>
            <p className="mt-4 text-sm leading-6 text-green-100/80">
              Simpan riwayat scan, temukan kerajinan daur ulang, dan siapkan tokomu dari satu tempat.
            </p>
          </div>

          <div className="relative mt-10 min-h-80 flex-1">
            <Image
              src="/img/botol_plastik_pot_bunga.png"
              alt="Pot bunga hasil upcycling botol plastik"
              fill
              sizes="50vw"
              className="object-contain object-center p-4"
            />
          </div>

          <p className="text-sm font-semibold text-green-100">Masuk aman dengan session cookie yang dikelola server.</p>
        </aside>
      </div>
    </main>
  );
}
