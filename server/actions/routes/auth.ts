'use server'

import { lucia } from '@/server/auth/lucia'
import { protectedAction } from '../safe-action'
import { cookies } from 'next/headers'

export const logout = protectedAction.metadata({ name: 'logout' }).action(async ({ ctx }) => {
  await lucia.invalidateSession(ctx.session.id)
  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  return { success: true }
})
