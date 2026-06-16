export default function BankSampahHeader() {
  return (
    <header className="pt-32 pb-10 px-6 sm:px-10 lg:px-16 max-w-screen-xl mx-auto">
      <p className="text-xs uppercase tracking-[0.35em] text-green-700 font-bold mb-3">
        Limbara · Komunitas
      </p>
      <h1 className="text-4xl sm:text-5xl font-black text-black leading-tight max-w-xl">
        Bank Sampah
        <br />
        <span className="text-green-700">Terdekat</span>
      </h1>
      <p className="mt-4 text-black/60 max-w-md leading-relaxed">
        Temukan lokasi bank sampah dan pusat daur ulang di sekitar kamu. Data bersumber
        dari jaringan komunitas lokal.
      </p>
    </header>
  );
}