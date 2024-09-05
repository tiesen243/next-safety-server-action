'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useSession } from '@/lib/session'

export const User: React.FC = () => {
  const { isAuth, user } = useSession()
  if (!isAuth)
    return (
      <div>
        <Link href="/sign-up" className="hover:underline">
          Register
        </Link>
        <span className="mx-2">|</span>
        <Link href="/sign-in" className="hover:underline">
          Login
        </Link>
      </div>
    )

  return (
    <Link href="/profile" className="group flex items-center gap-2">
      <p>{user.userName}</p>

      <Image
        src={user.avatar ?? '/logo.svg'}
        alt="avatar"
        width={28}
        height={28}
        className="rounded-full object-cover ring-2 ring-transparent group-hover:ring-ring"
      />
    </Link>
  )
}
