import { useState } from 'react'
import Hero from './components/Hero'
import Auth from './components/Auth'
import Chat from './components/Chat'

function App() {
  const [authedUser, setAuthedUser] = useState(null)

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      <Hero />
      <div className="relative z-10 max-w-6xl mx-auto px-6 -mt-24 pb-24">
        {!authedUser ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/5 rounded-2xl ring-1 ring-white/10 p-6">
              <h2 className="text-2xl font-semibold mb-2">Masuk untuk memulai</h2>
              <p className="text-white/70 mb-4">Autentikasi aman dengan email/sandi atau Google. Setelah login, Anda dapat mengobrol dengan VELLTOOLS dan menyimpan riwayat percakapan Anda.</p>
              <Auth onAuthed={setAuthedUser} />
            </div>
            <div className="bg-white/5 rounded-2xl ring-1 ring-white/10 p-6">
              <h3 className="text-xl font-semibold mb-2">Tentang VELLTOOLS</h3>
              <ul className="list-disc list-inside text-white/80 space-y-2">
                <li>Fokus 100% pada script Game Guardian (Lua)</li>
                <li>Siap membuat, mengoptimasi, dan memodifikasi sesuai instruksi</li>
                <li>Output akhir selalu dalam blok kode Lua dan runnable</li>
                <li>Riwayat obrolan tersimpan lokal di browser</li>
              </ul>
            </div>
          </div>
        ) : (
          <Chat user={authedUser} />
        )}
      </div>
    </div>
  )
}

export default App
