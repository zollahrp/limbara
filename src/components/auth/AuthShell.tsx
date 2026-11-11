import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthShellProps {
  title: string;
  description: string;
  visualTitle: string;
  visualAccent: string;
  visualDescription: string;
  children: ReactNode;
}

export default function AuthShell({
  title,
  description,
  visualTitle,
  visualAccent,
  visualDescription,
  children,
}: AuthShellProps) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#f7f4ee] p-4 sm:p-8">
      <div className="relative z-10 flex w-full max-w-5xl overflow-hidden rounded-[2.5rem] bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
        <section className="relative z-20 flex w-full flex-col justify-center bg-white p-8 sm:p-14 lg:w-1/2 lg:p-16" aria-labelledby="auth-title">
          <div className="mb-8 text-center sm:text-left">
            <Link
              href="/"
              className="mb-9 inline-block rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-800/20"
            >
              <Image
                src="/img/logo/limbara.png"
                alt="Limbara"
                width={150}
                height={45}
                priority
                className="mx-auto object-contain sm:mx-0"
              />
            </Link>

            <h1 id="auth-title" className="mb-3 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
              {title}
            </h1>
            <p className="text-sm font-medium leading-6 text-gray-600 sm:text-base">{description}</p>
          </div>

          {children}

          <p className="mt-7 px-4 text-center text-xs font-medium leading-relaxed text-gray-500">
            Dengan melanjutkan, kamu menyetujui Ketentuan Layanan dan Kebijakan Privasi Limbara.
          </p>
        </section>

        <aside className="group relative hidden w-1/2 items-end justify-start overflow-hidden bg-green-950 p-16 lg:flex" aria-label="Tentang akun Limbara">
          <div className="absolute inset-0 bg-[url('/img/botol_plastik_pot_bunga.png')] bg-cover bg-center opacity-40 mix-blend-luminosity transition-transform duration-1000 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950 via-green-950/80 to-transparent" />

          <div className="relative z-10 max-w-md">
            <p className="mb-6 inline-block rounded-full border border-green-700/30 bg-green-800/20 px-4 py-2 text-xs font-black uppercase tracking-widest text-green-300">
              Akun Limbara
            </p>
            <h2 className="mb-6 text-4xl font-black leading-[1.1] text-white">
              {visualTitle}
              <br />
              <span className="text-green-400">{visualAccent}</span>
            </h2>
            <p className="text-sm font-medium leading-relaxed text-green-100/70">{visualDescription}</p>
          </div>
        </aside>
      </div>
    </main>
  );
}

interface GoogleAuthButtonProps {
  onClick: () => void;
}

export function GoogleAuthButton({ onClick }: GoogleAuthButtonProps) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="group flex w-full items-center justify-center gap-4 rounded-2xl border-2 border-gray-100 bg-white p-4 font-bold text-gray-700 shadow-sm transition-all hover:border-gray-200 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-800/20"
    >
      <svg className="h-6 w-6 transition-transform group-hover:scale-110" viewBox="0 0 24 24" aria-hidden="true">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      <span className="tracking-wide">Lanjutkan dengan Google</span>
    </button>
  );
}
