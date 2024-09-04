'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Loader2Icon, MoonIcon, SunIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

export const ThemeBtn: React.FC = () => {
  const { theme, resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')

  const [isMounted, setIsMounted] = useState<boolean>(false)
  useEffect(() => setIsMounted(true), [])
  if (!isMounted)
    return (
      <Button variant="ghost" size="icon">
        <Loader2Icon className="animate-spin" />
      </Button>
    )

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </Button>
  )
}
