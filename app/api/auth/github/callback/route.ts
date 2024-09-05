import { OAuth2RequestError } from 'arctic'
import { type NextRequest, NextResponse } from 'next/server'

import { github, lucia } from '@/server/auth/lucia'
import { db } from '@/server/db'
import { cookies } from 'next/headers'

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = req.cookies.get('github_oauth_state')?.value ?? null
  if (!code || !state || state !== storedState)
    return NextResponse.json({ message: 'Invalid state' }, { status: 400 })

  try {
    const tokens = await github.validateAuthorizationCode(code)
    const githubUserRes = await fetch('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    })
    const githubUser = (await githubUserRes.json()) as GithubUser

    // check if user exists in database
    const existedUser = await db.user.findUnique({ where: { email: githubUser.email } })
    if (existedUser) {
      await db.user.update({
        where: { id: existedUser.id },
        data: {
          githubId: githubUser.id,
          name: githubUser.name,
          userName: githubUser.login,
          email: githubUser.email,
          avatar: githubUser.avatar_url,
        },
      })

      const session = await lucia.createSession(existedUser.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

      return NextResponse.redirect(new URL('/', req.url))
    }

    const newUser = await db.user.create({
      data: {
        githubId: githubUser.id,
        name: githubUser.name,
        userName: githubUser.login,
        email: githubUser.email,
        avatar: githubUser.avatar_url,
      },
    })

    const session = await lucia.createSession(newUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return NextResponse.redirect(new URL('/', req.url))
  } catch (e) {
    if (e instanceof OAuth2RequestError)
      return NextResponse.json({ message: e.message, description: e.description }, { status: 400 })
    if (e instanceof Error) return NextResponse.json({ message: e.message }, { status: 500 })
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}

interface GithubUser {
  id: number
  login: string
  name: string
  email: string
  avatar_url: string
}
