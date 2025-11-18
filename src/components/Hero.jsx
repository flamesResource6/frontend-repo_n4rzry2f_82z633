import Spline from '@splinetool/react-spline'

export default function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Spline scene="https://prod.spline.design/4cHQr84zOGAHOehh/scene.splinecode" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-24">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 ring-1 ring-white/20 px-4 py-2 text-sm text-white backdrop-blur pointer-events-none">
          <span className="inline-block w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-orange-300 animate-pulse" />
          VELLTOOLS • AI Assistant for Game Guardian (Lua)
        </div>
        <h1 className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_0_30px_rgba(88,101,242,0.35)]">
          Bangun, optimalkan, dan modifikasi script Game Guardian
        </h1>
        <p className="mt-4 text-lg text-white/80">
          Login untuk memulai percakapan. Simpan riwayat obrolan Anda secara otomatis di perangkat dan cloud browser.
        </p>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/80" />
    </section>
  )
}
