import type { NextPage } from 'next'

import { CreatePost } from '@/components/create-post'
import { PostList } from '@/components/post-list'

interface Props {
  searchParams: { page?: number }
}

const Page: NextPage<Props> = ({ searchParams }) => (
  <main className="container py-4">
    <PostList page={searchParams.page} />
    <CreatePost />
  </main>
)

export default Page
