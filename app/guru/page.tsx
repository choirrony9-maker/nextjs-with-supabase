import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function GuruDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'guru') {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-red-600">Akses Ditolak</h1>
        <p className="mt-2">Halaman ini hanya untuk Guru.</p>
        <Link href="/" className="mt-4 text-blue-600 underline">Kembali ke Beranda</Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Guru</h1>
          <Link href="/" className="text-blue-600 hover:underline">Kembali ke Beranda</Link>
        </div>

        <p className="text-lg mb-6">Selamat datang, <strong>{profile.full_name || user.email}</strong>!</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/guru/soal/baru" className="block p-6 bg-white rounded-lg shadow hover:shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">➕ Tambah Soal Baru</h2>
            <p className="text-gray-600">Buat soal pilihan ganda untuk kelas 1-6.</p>
          </Link>

          <Link href="/guru/soal" className="block p-6 bg-white rounded-lg shadow hover:shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold mb-2">📋 Daftar Soal</h2>
            <p className="text-gray-600">Lihat, edit, atau hapus soal yang sudah dibuat.</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
