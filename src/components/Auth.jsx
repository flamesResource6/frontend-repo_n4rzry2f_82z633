import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, updateProfile } from 'firebase/auth'

const firebaseConfig = { 
  apiKey: "AIzaSyDjYOiextG4oic5TL8CYl7LktBrMiFoANw", 
  authDomain: "call-of-duty-5b269.firebaseapp.com", 
  databaseURL: "https://call-of-duty-5b269-default-rtdb.asia-southeast1.firebasedatabase.app", 
  projectId: "call-of-duty-5b269", 
  storageBucket: "call-of-duty-5b269.firebasestorage.app", 
  messagingSenderId: "455873203632", 
  appId: "1:455873203632:web:9dd81e8234940a40259a75", 
  measurementId: "G-CFFQKLB0DC" 
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u)
      if (u) onAuthed?.(u)
    })
    return () => unsub()
  }, [onAuthed])

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const { user } = await createUserWithEmailAndPassword(auth, email, password)
        if (name) {
          await updateProfile(user, { displayName: name })
        }
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const google = async () => {
    setError('')
    try {
      await signInWithPopup(auth, provider)
    } catch (err) {
      setError(err.message)
    }
  }

  if (user) {
    return (
      <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur rounded-2xl ring-1 ring-white/15 p-6 text-white">
        <div className="flex items-center gap-3">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&background=4f46e5&color=fff`} className="w-10 h-10 rounded-full" />
          <div>
            <div className="font-semibold">{user.displayName || 'Pengguna'}</div>
            <div className="text-white/70 text-sm">{user.email}</div>
          </div>
        </div>
        <button onClick={() => signOut(auth)} className="mt-4 w-full bg-red-500 hover:bg-red-600 transition text-white rounded-lg py-2">Keluar</button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white/10 backdrop-blur rounded-2xl ring-1 ring-white/15 p-6 text-white">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">{mode === 'login' ? 'Masuk' : 'Daftar'}</h3>
        <button onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-indigo-300 hover:text-white text-sm">
          {mode === 'login' ? 'Buat akun' : 'Sudah punya akun? Masuk'}
        </button>
      </div>
      <form onSubmit={submit} className="space-y-3">
        {mode === 'register' && (
          <input value={name} onChange={e=>setName(e.target.value)} placeholder="Nama lengkap" className="w-full rounded-lg bg-white/10 ring-1 ring-white/20 px-3 py-2 outline-none placeholder-white/60" />
        )}
        <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg bg-white/10 ring-1 ring-white/20 px-3 py-2 outline-none placeholder-white/60" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Kata sandi" className="w-full rounded-lg bg-white/10 ring-1 ring-white/20 px-3 py-2 outline-none placeholder-white/60" />
        {error && <div className="text-red-300 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 transition text-white rounded-lg py-2">
          {loading ? 'Memproses...' : (mode === 'login' ? 'Masuk' : 'Daftar')}
        </button>
      </form>
      <div className="my-4 flex items-center gap-3">
        <div className="h-px flex-1 bg-white/20" />
        <span className="text-white/60 text-sm">atau</span>
        <div className="h-px flex-1 bg-white/20" />
      </div>
      <button onClick={google} className="w-full bg-white text-slate-900 hover:bg-slate-100 transition rounded-lg py-2 font-semibold">
        Lanjutkan dengan Google
      </button>
    </div>
  )
}
