import Image from 'next/image'
import Link from 'next/link'
import { User } from './user'
import { ThemeBtn } from './theme-btn'

export const Header: React.FC = () => {
  return (
    <header className="sticky inset-0 z-50 border-b bg-background/70 py-2 backdrop-blur-xl backdrop-saturate-150">
      <div className="container flex items-center justify-between gap-4">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="logo"
            width={28}
            height={28}
            className="object-cover dark:invert"
          />
        </Link>

        <div className="flex items-center gap-2">
          <User />
          <ThemeBtn />
        </div>
      </div>
    </header>
  )
}
