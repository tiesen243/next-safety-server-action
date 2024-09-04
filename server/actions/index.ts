import * as auth from '@/server/actions/routes/auth'
import * as post from '@/server/actions/routes/post'

/**
 * Create a caller for the server actions.
 * @example
 * const res = await actions.post.getPosts()
 *       ^? Post[]
 */
export const actions = {
  auth,
  post,
}

/**
 * export type definition of API
 * @example
 * const posts: Awaited<ReturnType<Actions['post']['getPosts']>>
 *      ^? data: {
 *          posts: Post[]
 *         }
 */
export type Actions = typeof actions
