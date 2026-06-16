import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; 
import { cookies } from 'next/headers'; // 1. Tambahkan import ini

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Ambil rute pengalihan selanjutnya jika ada, default ke beranda
  const next = searchParams.get('next') ?? '/';

  if (code) {
    // 2. Panggil dan tunggu cookies()-nya
    const cookieStore = await cookies(); 
    
    // 3. Masukkan cookieStore sebagai argumen (Tidak pakai await di sini karena fungsi di server.ts tidak async)
    const supabase = createClient(cookieStore); 
    
    // Tukarkan kode rahasia dari URL menjadi sesi login user yang sah
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // Jika berhasil, arahkan user ke halaman utama atau halaman 'next'
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Jika terjadi kesalahan atau kode tidak valid, arahkan ke halaman error login
  return NextResponse.redirect(`${origin}/login?error=auth-callback-failed`);
}