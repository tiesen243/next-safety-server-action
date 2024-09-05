'use client'

import { useAction } from 'next-safe-action/hooks'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { FormField } from '@/components/ui/form-field'
import { actions } from '@/server/actions'

export const SignUpForm: React.FC = () => {
  const router = useRouter()

  const { execute, isPending, result } = useAction(actions.auth.signUp, {
    onSuccess: () => {
      toast.success('Registered successfully')
      router.push('/sign-in')
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
        Register
      </Button>

      <p className="text-center text-sm">
        Already have an account?{' '}
        <button type="button" className="hover:underline" onClick={() => router.push('/sign-in')}>
          Login
        </button>
      </p>
    </form>
  )
}

const fields = [
  { name: 'userName' as const, type: 'text', label: 'User Name', placeholder: 'Yuki' },
  { name: 'email' as const, type: 'email', label: 'Email', placeholder: 'yuki@tiesen.id.vn' },
  { name: 'password' as const, type: 'password', label: 'Password', placeholder: '********' },
  {
    name: 'confirmPassword' as const,
    type: 'password',
    label: 'Confirm Password',
    placeholder: '********',
  },
]
