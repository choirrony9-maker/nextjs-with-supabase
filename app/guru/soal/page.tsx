import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DaftarSoalPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'guru') {
    redirect('/')
  }

  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })

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

        {questions && questions.length > 0 ? (
          <div className="space-y-4">
            {questions.map((q) => (
              <div key={q.id} className="bg-white p-4 rounded-lg shadow border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-semibold text-blue-600">
                    Kelas {q.class_level} • {q.subject}
                  </span>
                  <span className="text-xs text-gray-500">
                    Jawaban: <strong>{q.correct_answer}</strong>
                  </span>
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
            <p className="text-gray-500">Belum ada soal. Silakan tambahkan soal pertama!</p>
          </div>
        )}
      </div>
    </main>
  )
}
