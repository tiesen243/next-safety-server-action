import { createMiddleware, createSafeActionClient } from 'next-safe-action'
import { zodAdapter } from 'next-safe-action/adapters/zod'
import { z } from 'zod'

import { auth } from '@/server/auth'
import { db } from '@/server/db'

const context = createMiddleware().define(async ({ next }) => {
  const { user, session } = await auth()
  return next({ ctx: { db, user, session } })
})

const action = createSafeActionClient({
  validationAdapter: zodAdapter(),
  defaultValidationErrorsShape: 'flattened',
  defineMetadataSchema: () => z.object({ name: z.string().min(1, 'Action name is required') }),
}).use(context)

const timmingMiddleware = createMiddleware<{ metadata: { name: string } }>().define(
  async ({ next, metadata }) => {
    const startTime = performance.now()
    const result = await next()
    const endTime = performance.now()
    console.log(`Action "${metadata.name}" took ${endTime - startTime}ms to execute`)
    return result
  },
)

export const publicAction = action.use(timmingMiddleware)

export const protectedAction = action
  .use(timmingMiddleware)
  .use(async ({ next, ctx: { user, session } }) => {
    if (!user || !session) throw new Error('You must be logged in to perform this action')
    return next({ ctx: { user, session } })
  })
