import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let role = null
  let fullName = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single()
    if (profile) {
      role = profile.role
      fullName = profile.full_name
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">Perpustakaan Soal SD</h1>
      <p className="text-lg mb-8">Selamat datang di sistem bank soal untuk kelas 1-6.</p>

      {user ? (
        <div className="flex flex-col items-center gap-4">
          <p className="text-md">Halo, <strong>{fullName || user.email}</strong> ({role})</p>
          {role === 'guru' && (
            <Link href="/guru" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 w-64">
              Masuk Dashboard Guru
            </Link>
          )}
          <Link href="/latihan" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 w-64">
            Mulai Latihan Soal
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Link href="/auth/login" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 w-64">
            Login
          </Link>
          <Link href="/auth/sign-up" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 w-64">
            Daftar
          </Link>
        </div>
      )}
    </main>
  )
}
