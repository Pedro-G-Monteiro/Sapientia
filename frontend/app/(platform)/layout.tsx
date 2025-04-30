// app/(platform)/layout.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import AppLayout from '@/components/ui/Layout/AppLayout'

const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL!

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get('authToken')?.value;
  console.log("Token:", token);
  if (!token) {
    redirect('/login')
  }

  const res = await fetch(`${API_URL}/api/v1/me`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store',
  })
  if (!res.ok) {
    redirect('/login')
  }

  return <AppLayout>{children}</AppLayout>
}
