'use client'

import Link from 'next/link'
import Image from 'next/image'

import { useSession } from '@/lib/session'
import { actions } from '@/server/actions'

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

      <div className="flex flex-col items-start">
        <p>{user.userName}</p>
        <button
          onClick={() => actions.auth.logout()}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Logout
        </button>
      </div>
    </div>
  )
}
