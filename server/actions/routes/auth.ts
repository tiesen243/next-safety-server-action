'use server'

import { cookies } from 'next/headers'

import { lucia } from '@/server/auth/lucia'
import { protectedAction } from '@/server/actions/safe-action'

export const logout = protectedAction.metadata({ name: 'logout' }).action(async ({ ctx }) => {
  await lucia.invalidateSession(ctx.session.id)
  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  return { success: true }
})
