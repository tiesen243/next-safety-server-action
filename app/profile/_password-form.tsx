'use client'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { useSession } from '@/lib/session'
import { actions } from '@/server/actions'
import { useAction } from 'next-safe-action/hooks'

export const PasswordForm: React.FC = () => {
  const { isAuth, user } = useSession()

  const createPassword = useAction(actions.auth.createPassword)
  const changePassword = useAction(actions.auth.changePassword)

  if (!isAuth) return null

  const action = (formData: FormData) => {
    if (user.password === null) createPassword.execute(formData)
    else changePassword.execute(formData)
  }

  const isPending = createPassword.isPending || changePassword.isPending

  return (
    <form action={action} className="mx-auto max-w-screen-md space-y-4">
      {user.password && (
        <FormField
          name="currentPassword"
          label="Current password"
          type="password"
          disabled={isPending}
        />
      )}

      <FormField name="password" label="New password" type="password" disabled={isPending} />
      <FormField
        name="confirmPassword"
        label="Confirm password"
        type="password"
        disabled={isPending}
      />

      <Button className="w-full" disabled={isPending}>
        {user.password === null ? 'Create password' : 'Change password'}
      </Button>
    </form>
  )
}
