'use server'

import { Scrypt } from 'lucia'
import { cookies } from 'next/headers'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { protectedAction, publicAction } from '@/server/actions/safe-action'
import { lucia } from '@/server/auth/lucia'

export const signUp = publicAction
  .metadata({ name: 'signUp' })
  .schema(
    zfd
      .formData({
        userName: z.string().min(1, 'User Name is required'),
        email: z.string().email(),
        password: z.string().min(8, 'Password must be at least 8 characters'),
        confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
      })
      .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      }),
  )
  .action(async ({ parsedInput, ctx }) => {
    const { userName, email, password } = parsedInput

    const existedUser = await ctx.db.user.findUnique({ where: { email } })
    if (existedUser) throw new Error('User already exists')

    const hashedPassword = await new Scrypt().hash(password)
    const newUser = await ctx.db.user.create({
      data: { userName, email, password: hashedPassword },
    })
    if (!newUser) throw new Error('Failed to create user')

    return { success: true }
  })

export const signIn = publicAction
  .metadata({ name: 'signIn' })
  .schema(
    zfd.formData({
      email: z.string().email(),
      password: z.string().min(8, 'Password must be at least 8 characters'),
    }),
  )
  .action(async ({ parsedInput: { email, password }, ctx }) => {
    const user = await ctx.db.user.findUnique({ where: { email } })
    if (!user) throw new Error('User not found')
    if (!user.password) throw new Error('User has no password')

    const isValid = await new Scrypt().verify(user.password, password)
    if (!isValid) throw new Error('Password is incorrect')

    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

    return { success: true }
  })

export const logout = protectedAction.metadata({ name: 'logout' }).action(async ({ ctx }) => {
  await lucia.invalidateSession(ctx.session.id)
  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)

  return { success: true }
})

const passwordSchema = zfd
  .formData({
    currentPassword: z.string().min(8, 'Password must be at least 8 characters').optional(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const createPassword = protectedAction
  .metadata({ name: 'createPassword' })
  .schema(passwordSchema)
  .action(async ({ parsedInput: { password }, ctx }) => {
    const hashedPassword = await new Scrypt().hash(password)
    await ctx.db.user.update({ where: { id: ctx.user.id }, data: { password: hashedPassword } })

    return { success: true }
  })

export const changePassword = protectedAction
  .metadata({ name: 'changePassword' })
  .schema(passwordSchema)
  .action(async ({ parsedInput: { currentPassword, password }, ctx }) => {
    if (!ctx.user.password) throw new Error('User has no password')

    const isValid = await new Scrypt().verify(ctx.user.password, currentPassword!)
    if (!isValid) throw new Error('Current password is incorrect')

    const hashedPassword = await new Scrypt().hash(password)
    await ctx.db.user.update({ where: { id: ctx.user.id }, data: { password: hashedPassword } })

    return { success: true }
  })
