'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Toggle } from '@/components/ui/toggle'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Toggle
      pressed={theme === 'dark'}
      onPressedChange={(pressed) => setTheme(pressed ? 'dark' : 'light')}
      aria-label="Toggle theme"
      className="hover:bg-transparent"
    >
      {theme === 'dark' ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Toggle>
  )
}
