'use client'

import type { Session, User } from '@prisma/client'
import { createContext, useContext } from 'react'

type SessionContext =
  | {
      isAuth: false
      session: null
      user: null
    }
  | {
      isAuth: true
      session: Session
      user: User
    }

const sessionContext = createContext<SessionContext>({} as SessionContext)

export const SessionProvider: React.FC<{
  children: React.ReactNode
  user: User | null
  session: Session | null
}> = ({ children, session, user }) => {
  const isAuth = !!user && !!session

  return (
    <sessionContext.Provider
      value={isAuth ? { isAuth, session, user } : { isAuth, session: null, user: null }}
    >
      {children}
    </sessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(sessionContext)
  if (context === undefined) throw new Error('useSession must be used within a SessionProvider')
  return context
}
