import { createSafeActionClient } from 'next-safe-action'
import { zodAdapter } from 'next-safe-action/adapters/zod'
import { z } from 'zod'

import { auth } from '@/server/auth'
import { db } from '@/server/db'

export const action = createSafeActionClient({
  validationAdapter: zodAdapter(),
  defineMetadataSchema: () => z.object({ name: z.string().min(1, 'Action name is required') }),
}).use(async ({ next, metadata }) => {
  const startTime = performance.now()
  const result = await next({ ctx: { db } })
  const endTime = performance.now()
  console.log(`Action "${metadata.name}" took ${endTime - startTime}ms to execute`)
  return result
})

export const protectedAction = action.use(async ({ next }) => {
  const { user, session } = await auth()
  if (!user || !session) throw new Error('You must be logged in to perform this action')
  return next({ ctx: { user, session } })
})
