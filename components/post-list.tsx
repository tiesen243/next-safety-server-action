import { XIcon } from 'lucide-react'
import Link from 'next/link'

import { Button, buttonVariants } from '@/components/ui/button'
import { actions } from '@/server/actions'

export const PostList: React.FC<{ page?: number }> = async ({ page = 1 }) => {
  const res = await actions.post.getPosts({ limit: 3, page: +page })
  if (!res?.data) return null

  const { posts, totalPage } = res.data

  return (
    <ul className="mx-auto mb-4 w-1/2 space-y-4">
      {posts.map((post) => (
        <li key={post.id} className="rounded-lg border p-4 shadow-md">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">{post.content}</h3>
          <small className="text-muted-foreground">By {post.user.userName}</small>

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
          <Link
            key={p}
            href={{ query: { page: p } }}
            className={buttonVariants({
              size: 'icon',
              variant: 'outline',
              className: p === +page && 'bg-accent text-accent-foreground',
            })}
          >
            {p}
          </Link>
        ))}
      </div>
    </ul>
  )
}
