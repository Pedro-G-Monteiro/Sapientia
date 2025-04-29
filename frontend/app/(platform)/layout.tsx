// app/(platform)/layout.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/ui/Layout/AppLayout'

const API_URL = process.env.NEXT_PUBLIC_API_URL!

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('token')?.value
  if (!token) {
    redirect('/login')
  }

  const res = await fetch(`${API_URL}/me`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) {
    redirect('/login')
  }

  return <AppLayout>{children}</AppLayout>
}
