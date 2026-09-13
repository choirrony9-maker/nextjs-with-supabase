'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function TambahSoalPage() {
  const router = useRouter()
  const supabase = createClient()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    class_level: 1,
    subject: '',
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_answer: 'A',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.from('questions').insert({
      class_level: Number(form.class_level),
      subject: form.subject,
      question_text: form.question_text,
      option_a: form.option_a,
      option_b: form.option_b,
      option_c: form.option_c,
      option_d: form.option_d,
      correct_answer: form.correct_answer,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      alert('Soal berhasil disimpan!')
      router.push('/guru/soal')
    }
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Tambah Soal Baru</h1>
          <Link href="/guru" className="text-blue-600 hover:underline">Kembali</Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Kelas</label>
            <select
              name="class_level"
              value={form.class_level}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>Kelas {n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Mata Pelajaran</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              placeholder="Contoh: Matematika"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pertanyaan</label>
            <textarea
              name="question_text"
              value={form.question_text}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Tulis pertanyaan di sini..."
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pilihan A</label>
              <input type="text" name="option_a" value={form.option_a} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pilihan B</label>
              <input type="text" name="option_b" value={form.option_b} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pilihan C</label>
              <input type="text" name="option_c" value={form.option_c} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pilihan D</label>
              <input type="text" name="option_d" value={form.option_d} onChange={handleChange} required className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Jawaban Benar</label>
            <select name="correct_answer" value={form.correct_answer} onChange={handleChange} className="w-full border border-gray-300 rounded px-3 py-2">
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Menyimpan...' : 'Simpan Soal'}
          </button>
        </form>
      </div>
    </main>
  )
}
