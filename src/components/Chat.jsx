import { useEffect, useRef, useState } from 'react'
import Bytez from 'bytez.js'

const key = '8b24331e90515d67c9c3030bdc0b8e0f'
const sdk = new Bytez(key)
const model = sdk.model('Qwen/Qwen3-4B-Instruct-2507')

const SYSTEM_PROMPT = `Mulai sekarang, Anda adalah VELLTOOLS. Aturan ketat: 1. Fokus sepenuhnya hanya pada script Game Guardian (Lua). 2. Jangan menanggapi pertanyaan, komentar, atau permintaan apapun selain pembuatan, optimasi, atau modifikasi script Game Guardian. 3. Semua pekerjaan yang dilakukan wajib 100% berhubungan dengan script Game Guardian. 4. Jangan mengirim placeholder, contoh umum, atau teks penjelasan. 5. Jangan menambahkan fitur atau modul yang tidak diminta. 6. Jangan menggabungkan dengan potongan script lain kecuali diperintahkan secara spesifik. 7. Hasil akhir wajib dikirim dalam blok kode Lua: \"```lua\\n-- kode hasil akhir di sini\\n```\". 8. Tunggu instruksi saya untuk mulai membuat, mengoptimalkan, atau memodifikasi script. 9. Semua output harus langsung runnable di Game Guardian tanpa error. Peran Anda adalah VELLTOOLS, asisten profesional untuk Game Guardian yang siap menerima instruksi script apa pun dari saya`;

function useChatStorage() {
  const save = (id, data) => {
    localStorage.setItem(`chat:${id}`, JSON.stringify(data))
  }
  const load = (id) => {
    const v = localStorage.getItem(`chat:${id}`)
    return v ? JSON.parse(v) : null
  }
  const list = () => {
    return Object.keys(localStorage)
      .filter(k => k.startsWith('chat:'))
      .map(k => ({ id: k.split(':')[1], ...JSON.parse(localStorage.getItem(k)) }))
      .sort((a,b) => (b.updatedAt||0)-(a.updatedAt||0))
  }
  const remove = (id) => localStorage.removeItem(`chat:${id}`)
  return { save, load, list, remove }
}

export default function Chat({ user }) {
  const { save, load, list, remove } = useChatStorage()
  const [chats, setChats] = useState(list())
  const [currentId, setCurrentId] = useState(chats[0]?.id || crypto.randomUUID())
  const [messages, setMessages] = useState(load(currentId)?.messages || [])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const endRef = useRef(null)

  // persist
  useEffect(() => {
    const meta = { title: messages[0]?.content?.slice(0,40) || 'Obrolan Baru', messages, updatedAt: Date.now(), userId: user?.uid }
    save(currentId, meta)
    setChats(list())
  }, [messages, currentId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const newChat = () => {
    const id = crypto.randomUUID()
    setCurrentId(id)
    setMessages([])
  }

  const send = async () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    const hist = messages.length ? messages : [{ role: 'system', content: SYSTEM_PROMPT }]
    setMessages([...hist, userMsg])
    setInput('')
    setLoading(true)
    try {
      const { error, output } = await model.run([...hist, userMsg])
      if (error) throw new Error(error.message || 'Gagal memproses')
      const text = Array.isArray(output) ? (output[0]?.content || '') : (output?.content || '')
      setMessages(prev => [...prev, { role: 'assistant', content: text }])
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Terjadi kesalahan: ${e.message}` }])
    } finally {
      setLoading(false)
    }
  }

  const loadChat = (id) => {
    const data = load(id)
    if (data) {
      setCurrentId(id)
      setMessages(data.messages || [])
    }
  }

  const delChat = (id) => {
    remove(id)
    const l = list()
    setChats(l)
    if (id === currentId) {
      if (l[0]) loadChat(l[0].id)
      else newChat()
    }
  }

  return (
    <div className="flex h-[80vh] bg-white/5 rounded-2xl ring-1 ring-white/10 overflow-hidden">
      <aside className="w-64 bg-white/5 border-r border-white/10 p-3 hidden md:flex flex-col">
        <button onClick={newChat} className="mb-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg py-2">Obrolan Baru</button>
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {chats.map(c => (
            <div key={c.id} className={`group rounded-lg p-2 text-sm cursor-pointer ${currentId===c.id?'bg-indigo-500/20 ring-1 ring-indigo-400/40':'hover:bg-white/10'}`} onClick={()=>loadChat(c.id)}>
              <div className="flex items-center justify-between gap-2">
                <div className="truncate text-white/90">{c.title}</div>
                <button className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-400" onClick={(e)=>{e.stopPropagation(); delChat(c.id)}}>Hapus</button>
              </div>
              <div className="text-white/50 text-xs">{new Date(c.updatedAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </aside>
      <main className="flex-1 flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-white/10">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName||user?.email||'User')}&background=0ea5e9&color=fff`} className="w-8 h-8 rounded-full"/>
          <div className="text-white/80">VELLTOOLS Chat</div>
          <div className="ml-auto text-xs text-white/60">Model: Qwen3-4B-Instruct-2507</div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length===0 && (
            <div className="text-center text-white/60 mt-16">Mulai instruksikan VELLTOOLS untuk membuat/optimasi script Game Guardian (Lua).</div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`max-w-3xl ${m.role==='user'?'ml-auto':''}`}>
              <div className={`${m.role==='user'?'bg-indigo-500 text-white':'bg-white/10 text-white'} rounded-2xl px-4 py-3 whitespace-pre-wrap`}>{m.content}</div>
            </div>
          ))}
          {loading && <div className="text-white/60">Menulis...</div>}
          <div ref={endRef} />
        </div>
        <div className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){ e.preventDefault(); send() }}} placeholder="Tulis instruksi Anda (Lua Game Guardian saja)" className="flex-1 rounded-xl bg-white/10 ring-1 ring-white/20 px-4 py-3 text-white placeholder-white/60 outline-none" />
            <button onClick={send} disabled={loading} className="px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 disabled:opacity-60 text-white font-medium">Kirim</button>
          </div>
        </div>
      </main>
    </div>
  )
}
