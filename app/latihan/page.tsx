'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function LatihanPage() {
  const router = useRouter()
  const supabase = createClient()
  const [classLevel, setClassLevel] = useState(1)
  const [subject, setSubject] = useState('')
  const [subjects, setSubjects] = useState<string[]>([])
  const [loadingSubjects, setLoadingSubjects] = useState(true)

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoadingSubjects(true)
      setSubject('')
      const { data } = await supabase
        .from('questions')
        .select('subject')
        .eq('class_level', classLevel)

      if (data) {
        const unique = Array.from(new Set(data.map((q) => q.subject)))
        setSubjects(unique)
        if (unique.length > 0) setSubject(unique[0])
      } else {
        setSubjects([])
      }
      setLoadingSubjects(false)
    }
    fetchSubjects()
  }, [classLevel])

  const handleStart = () => {
    if (!subject) return
    router.push(`/latihan/mulai?kelas=${classLevel}&mapel=${encodeURIComponent(subject)}`)
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Latihan Soal</h1>
          <Link href="/" className="text-blue-600 hover:underline">Kembali</Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2">Pilih Kelas</label>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <button
                  key={n}
                  onClick={() => setClassLevel(n)}
                  className={`py-3 rounded-lg font-semibold border-2 ${
                    classLevel === n
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300'
                  }`}
                >
                  Kelas {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pilih Mata Pelajaran</label>
            {loadingSubjects ? (
              <p className="text-gray-500 text-sm">Memuat...</p>
            ) : subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {subjects.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSubject(s)}
                    className={`px-4 py-2 rounded-lg font-medium border-2 ${
                      subject === s
                        ? 'bg-green-600 text-white border-green-600'
                        : 'bg-white text-gray-700 border-gray-300'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-3 rounded text-sm">
                Belum ada soal untuk Kelas {classLevel}. Coba pilih kelas lain.
              </div>
            )}
          </div>

          <button
            onClick={handleStart}
            disabled={!subject}
            className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-300"
          >
            Mulai Latihan 🚀
          </button>
        </div>
      </div>
    </main>
  )
}
