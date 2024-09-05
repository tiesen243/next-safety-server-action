import type { NextPage } from 'next'

import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import { actions } from '@/server/actions'
import { Button } from '@/components/ui/button'
import { PasswordForm } from './_password-form'

const Page: NextPage = async () => {
  const { user } = await auth()
  if (!user) redirect('/sign-in')

  // @ts-expect-error password have to be removed
  delete user.password

  return (
    <main className="container">
      <pre className="mx-auto my-4 max-w-screen-md overflow-x-auto rounded-lg bg-secondary p-4 font-mono shadow-md">
        {JSON.stringify(user, null, 2)}
      </pre>

      <PasswordForm />

      <form
        className="mx-auto mt-4 max-w-screen-md [&>*]:w-full"
        action={async () => {
          'use server'
          await actions.auth.logout()
          redirect('/sign-in')
        }}
      >
        <Button variant="secondary">Sign out</Button>
      </form>
    </main>
  )
}

export default Page
