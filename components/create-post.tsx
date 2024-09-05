'use client'

import { actions } from '@/server/actions'
import { useAction } from 'next-safe-action/hooks'
import { useRef } from 'react'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useSession } from '@/lib/session'

export const CreatePost: React.FC = () => {
  const { isAuth } = useSession()
  const formRef = useRef<HTMLFormElement>(null!)
  const { execute, isPending, result } = useAction(actions.post.createPost, {
    onSuccess: () => formRef.current.reset(),
  })

  if (!isAuth) return null

  return (
    <form ref={formRef} action={execute} className="mx-auto max-w-screen-md space-y-4">
      <FormField
        name="content"
        disabled={isPending}
        message={result.validationErrors?.fieldErrors?.content}
      />
      <Button className="w-full" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create'}
      </Button>
    </form>
  )
}
