import { discord, lucia } from '@/server/auth/lucia'
import { db } from '@/server/db'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'

export const GET = async (req: NextRequest) => {
  const url = new URL(req.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const storedState = req.cookies.get('discord_oauth_state')?.value ?? null
  if (!code || !state || state !== storedState)
    return NextResponse.json({ message: 'Invalid state' }, { status: 400 })

  try {
    const tokens = await discord.validateAuthorizationCode(code)
    const discordUserRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokens.accessToken}` },
    })
    const discordUser = (await discordUserRes.json()) as DiscordUser

    // check if user exists in database
    const existedUser = await db.user.findUnique({ where: { discordId: discordUser.id } })
    if (existedUser) {
      await db.user.update({
        where: { id: existedUser.id },
        data: {
          userName: discordUser.username,
          email: discordUser.email,
          avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
        },
      })
      const session = await lucia.createSession(existedUser.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
      return NextResponse.redirect(new URL('/', req.url))
    }

    const newUser = await db.user.create({
      data: {
        discordId: discordUser.id,
        userName: discordUser.username,
        email: discordUser.email,
        avatar: `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`,
      },
    })

    const session = await lucia.createSession(newUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return NextResponse.redirect(new URL('/', req.url))
  } catch (e) {
    if (e instanceof Error) return NextResponse.json({ message: e.message }, { status: 500 })
    return NextResponse.json({ message: 'An error occurred' }, { status: 500 })
  }
}

interface DiscordUser {
  id: string
  username: string
  avatar: string
  email: string
}
