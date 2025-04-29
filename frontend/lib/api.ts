export async function apiFetch<T>(
    path: string,
    opts: RequestInit = {}
  ): Promise<T> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...opts,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(opts.headers || {}),
      },
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  }
  