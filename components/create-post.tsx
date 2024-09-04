'use client'

import { actions } from '@/server/actions'
import { useAction } from 'next-safe-action/hooks'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSession } from '@/lib/session'
import { useRef } from 'react'

export const CreatePost: React.FC = () => {
  const { isAuth } = useSession()
  const formRef = useRef<HTMLFormElement>(null!)
  const { execute, isPending, result } = useAction(actions.post.createPost)

  if (!isAuth) return null

  const action = async (formData: FormData) => {
    const content = String(formData.get('content'))
    execute({ content })
    formRef.current.reset()
  }

  const { validationErrors } = result

  return (
    <form ref={formRef} action={action} className="mx-auto w-1/2 space-y-4">
      <fieldset name="content" disabled={isPending}>
        <Input name="content" placeholder="What's on your mind?" />
        <small className="text-destructive">{validationErrors?.fieldErrors?.content}</small>
      </fieldset>

      <Button className="w-full" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </Button>
    </form>
  )
}
