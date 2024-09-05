import * as nsa from 'next-safe-action'
import { zodAdapter } from 'next-safe-action/adapters/zod'
import { z } from 'zod'

import { auth } from '@/server/auth'
import { db } from '@/server/db'

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * @see https://next-safe-action.dev/docs/define-actions/middleware#create-standalone-middleware
 */
const context = nsa.createMiddleware().define(async ({ next }) => {
  const { user, session } = await auth()
  return next({ ctx: { db, user, session } })
})

/**
 * 2. INITIALIZATION
 *
 * This is where the safe-action client is initialized, connecting the context.
 */
const action = nsa
  .createSafeActionClient({
    validationAdapter: zodAdapter(),
    defaultValidationErrorsShape: 'flattened',
    defineMetadataSchema: () => z.object({ name: z.string().min(1, 'Action name is required') }),
    handleServerError: ({ message }, { metadata }) => {
      if (message) {
        console.error(`[Server Error] ${metadata.name} threw an error: ${message}`)
        return message
      }

      return nsa.DEFAULT_SERVER_ERROR_MESSAGE
    },
  })
  .use(context)

/**
 * Middleware for timing action execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timmingMiddleware = nsa
  .createMiddleware<{ metadata: { name: string } }>()
  .define(async ({ next, metadata }) => {
    const start = performance.now()

    const result = await next()

    const end = performance.now()

    const time = Math.round((end - start) * 100) / 100
    console.log(`[Action] ${metadata.name} took ${time}ms to execute`)

    return result
  })

/**
 * Public (unauthenticated) action
 *
 * This action is available to anyone, regardless of whether they are logged in or not.
 *  */
export const publicAction = action.use(timmingMiddleware)

/**
 * Protected (authenticated) action
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session` and `ctx.user` is not null.
 */
export const protectedAction = action
  .use(timmingMiddleware)
  .use(async ({ next, ctx: { user, session } }) => {
    if (!session || !user) throw new Error('You must be logged in to perform this action')
    return next({ ctx: { user, session } })
  })
