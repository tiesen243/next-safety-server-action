import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'
import { generateState } from 'arctic'

import { github } from '@/server/auth/lucia'
import { env } from '@/env'

export const GET = async (req: NextRequest) => {
  const state = generateState()
  const url = await github.createAuthorizationURL(state, { scopes: ['user:email'] })

  cookies().set('github_oauth_state', state, {
    path: '/',
    secure: env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })

  return NextResponse.redirect(new URL(url, req.url))
}
