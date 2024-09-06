import { XIcon } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { actions } from '@/server/actions'

export const PostList: React.FC<{ page?: number }> = async ({ page = 1 }) => {
  const res = await actions.post.getPosts({ limit: 1, page: +page })
  if (!res?.data) return null

  const { posts, totalPage } = res.data

  return (
    <ul className="mx-auto mb-4 max-w-screen-md space-y-4">
      {posts.map((post) => (
        <li key={post.id} className="rounded-lg border p-4 pr-16 shadow-md">
          <h3 className="line-clamp-1 scroll-m-20 text-2xl font-semibold tracking-tight">
            {post.content}
          </h3>
          <small className="text-muted-foreground">
            By {post.user.userName} at {post.createdAt.toDateString()}
          </small>

          <form
            action={async () => {
              'use server'
              await actions.post.deletePost({ id: post.id })
            }}
            className="absolute right-2 top-2"
          >
            <Button variant="ghost" size="icon">
              <XIcon />
            </Button>
          </form>
        </li>
      ))}

      <div className="flex gap-2">
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            size="icon"
            variant="outline"
            className={p == page ? 'bg-accent text-accent-foreground' : ''}
            asChild
          >
            <Link href={{ query: { page: p } }}>{p}</Link>
          </Button>
        ))}
      </div>
    </ul>
  )
}
