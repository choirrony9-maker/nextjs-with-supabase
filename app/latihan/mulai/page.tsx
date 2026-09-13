'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

function KuisContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const supabase = createClient()

  const kelas = searchParams.get('kelas')
  const mapel = searchParams.get('mapel')

  const [questions, setQuestions] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!kelas || !mapel) return
      const { data } = await supabase
        .from('questions')
        .select('*')
        .eq('class_level', Number(kelas))
        .eq('subject', mapel)
        .order('id', { ascending: true })
      setQuestions(data || [])
      setLoading(false)
    }
    fetchQuestions()
  }, [kelas, mapel])

  const handleNext = () => {
    if (!selected) return
    setAnswers({ ...answers, [questions[currentIndex].id]: selected })
    setSelected(null)

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setFinished(true)
    }
  }

  const hitungSkor = () => {
    let benar = 0
    questions.forEach((q) => {
      if (answers[q.id] === q.correct_answer) benar++
    })
    return benar
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Memuat soal...</div>
  }

  if (questions.length === 0) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <p className="text-lg mb-4">Tidak ada soal untuk pilihan ini.</p>
        <Link href="/latihan" className="text-blue-600 underline">Kembali</Link>
      </main>
    )
  }

  // Tampilan Hasil Akhir
  if (finished) {
    const benar = hitungSkor()
    const total = questions.length
    const persen = Math.round((benar / total) * 100)

    return (
      <main className="min-h-screen p-6 bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Hasil Latihan</h1>
          <p className="text-6xl font-bold text-blue-600 mb-4">{persen}</p>
          <p className="text-lg mb-6">
            Benar <strong>{benar}</strong> dari <strong>{total}</strong> soal
          </p>

          <div className="text-left space-y-3 mb-6">
            {questions.map((q, i) => {
              const jawabanMurid = answers[q.id]
              const isBenar = jawabanMurid === q.correct_answer
              return (
                <div key={q.id} className={`p-3 rounded border ${isBenar ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-sm font-medium mb-1">{i + 1}. {q.question_text}</p>
                  <p className="text-xs">
                    Jawabanmu: <strong>{jawabanMurid || '-'}</strong> {isBenar ? '✅' : `❌ (Yang benar: ${q.correct_answer})`}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/latihan" className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
              Latihan Lagi
            </Link>
            <Link href="/" className="text-blue-600 underline">Kembali ke Beranda</Link>
          </div>
        </div>
      </main>
    )
  }

  // Tampilan Soal
  const q = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Soal {currentIndex + 1} dari {questions.length}</span>
            <span>Kelas {kelas} • {mapel}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow mb-4">
          <p className="text-xl font-medium mb-6">{q.question_text}</p>
          <div className="space-y-3">
            {['A', 'B', 'C', 'D'].map((opt) => {
              const text = q[`option_${opt.toLowerCase()}`]
              const isSelected = selected === opt
              return (
                <button
                  key={opt}
                  onClick={() => setSelected(opt)}
                  className={`w-full text-left p-4 rounded-lg border-2 font-medium ${
                    isSelected
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                  }`}
                >
                  <span className="font-bold mr-2">{opt}.</span> {text}
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={handleNext}
          disabled={!selected}
          className="w-full bg-green-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-green-700 disabled:bg-gray-300"
        >
          {currentIndex + 1 === questions.length ? 'Selesai ✅' : 'Soal Berikutnya →'}
        </button>
      </div>
    </main>
  )
}

export default function MulaiLatihanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Memuat...</div>}>
      <KuisContent />
    </Suspense>
  )
}
