'use client'

import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { actions } from '@/server/actions'

export const SignInForm: React.FC = () => {
  const router = useRouter()

  const { execute, isPending, result } = useAction(actions.auth.signIn, {
    onSuccess: () => {
      toast.success('Logged in successfully')
      router.push('/')
    },
    onError: ({ error }) => {
      if (!error.validationErrors) toast.error(error.serverError)
    },
  })

  return (
    <form action={execute} className="space-y-4">
      {fields.map((field) => (
        <FormField
          key={field.name}
          {...field}
          disabled={isPending}
          message={result.validationErrors?.fieldErrors?.[field.name]}
        />
      ))}

      <Button className="w-full" disabled={isPending}>
        Login
      </Button>

      <p className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <button type="button" className="hover:underline" onClick={() => router.push('/sign-up')}>
          Register
        </button>
      </p>
    </form>
  )
}

const fields = [
  { name: 'email' as const, type: 'email', label: 'Email', placeholder: 'yuki@tiesen.id.vn' },
  { name: 'password' as const, type: 'password', label: 'Password', placeholder: '********' },
]
