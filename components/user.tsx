'use client'

import Link from 'next/link'

import { useSession } from '@/lib/session'
import Image from 'next/image'

export const User: React.FC = () => {
  const { isAuth, user } = useSession()
  if (!isAuth) return <Link href="/api/auth/discord">Login</Link>

  return (
    <div className="flex items-center gap-2">
      <Image
        src={user.avatar ?? '/logo.svg'}
        alt="avatar"
        width={28}
        height={28}
        className="rounded-full object-cover"
      />

      <div className="space-y-1">
        <p>{user.userName}</p>
        <small className="text-muted-foreground">{user.email}</small>
      </div>
    </div>
  )
}
