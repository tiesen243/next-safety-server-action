'use server'

import { z } from 'zod'

import { publicAction, protectedAction } from '@/server/actions/safe-action'
import { revalidateTag } from 'next/cache'

export const getPosts = publicAction
  .metadata({ name: 'getPosts' })
  .schema(z.object({ limit: z.number().default(10), page: z.number().default(1) }))
  .action(async ({ parsedInput: { limit, page }, ctx }) => {
    const posts = await ctx.db.post.findMany({
      take: limit,
      skip: (page - 1) * limit,
      orderBy: { createdAt: 'desc' },
      select: { id: true, content: true, user: { select: { userName: true } } },
    })
    if (!posts || posts.length < 1) throw new Error('No posts found')

    const totalPage = Math.ceil((await ctx.db.post.count()) / limit)

    return { posts, totalPage }
  })

export const getPost = publicAction
  .metadata({ name: 'getPost' })
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx }) => {
    const post = await ctx.db.post.findUnique({ where: { id } })
    if (!post) throw new Error('Post not found')
    return post
  })

export const createPost = protectedAction
  .metadata({ name: 'createPost' })
  .schema(z.object({ content: z.string().min(1, 'Content is required') }))
  .action(async ({ parsedInput: { content }, ctx }) => {
    const newPost = await ctx.db.post.create({
      data: { content, user: { connect: { id: ctx.user.id } } },
    })
    if (!newPost) throw new Error('Failed to create post')
    revalidateTag('posts')
    return newPost
  })

export const deletePost = protectedAction
  .metadata({ name: 'deletePost' })
  .schema(z.object({ id: z.string() }))
  .action(async ({ parsedInput: { id }, ctx }) => {
    const post = await ctx.db.post.findUnique({ where: { id } })
    if (!post) throw new Error('Post not found')
    if (post.userId !== ctx.user.id) throw new Error('You are not author of this post')

    await ctx.db.post.delete({ where: { id } })
    revalidateTag('posts')
    return post
  })
