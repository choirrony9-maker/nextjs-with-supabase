'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function DaftarSoalPage() {
  const supabase = createClient()
  const [questions, setQuestions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filterKelas, setFilterKelas] = useState<string>('semua')
  const [filterMapel, setFilterMapel] = useState<string>('')

  const fetchQuestions = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', { ascending: false })
    setQuestions(data || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Yakin ingin menghapus soal ini?')) return
    const { error } = await supabase.from('questions').delete().eq('id', id)
    if (error) {
      alert('Gagal menghapus: ' + error.message)
    } else {
      fetchQuestions()
    }
  }

  const filtered = questions.filter((q) => {
    const matchKelas = filterKelas === 'semua' || q.class_level.toString() === filterKelas
    const matchMapel = q.subject.toLowerCase().includes(filterMapel.toLowerCase())
    return matchKelas && matchMapel
  })

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Soal</h1>
          <div className="flex gap-3">
            <Link href="/guru" className="text-blue-600 hover:underline">Dashboard</Link>
            <Link href="/guru/soal/baru" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ Tambah Soal</Link>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow mb-4 flex flex-col md:flex-row gap-3">
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="semua">Semua Kelas</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>Kelas {n}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Cari mata pelajaran..."
            value={filterMapel}
            onChange={(e) => setFilterMapel(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 flex-1"
          />
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">Memuat soal...</div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((q) => (
              <div key={q.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-blue-600">
                    Kelas {q.class_level} • {q.subject}
                  </span>
                  <div className="flex gap-3 items-center">
                    <span className="text-xs text-gray-500">
                      Jawaban: <strong>{q.correct_answer}</strong>
                    </span>
                    <button
                      onClick={() => handleDelete(q.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
                <p className="text-gray-800 mb-3">{q.question_text}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>A. {q.option_a}</div>
                  <div>B. {q.option_b}</div>
                  <div>C. {q.option_c}</div>
                  <div>D. {q.option_d}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-gray-500">Tidak ada soal yang cocok dengan filter.</p>
          </div>
        )}
      </div>
    </main>
  )
}
