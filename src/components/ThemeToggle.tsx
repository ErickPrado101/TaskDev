'use client'

import { useTheme } from "@/context/ThemeContext"

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme()

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded"
    >
      {darkMode ? '🌞 Modo Claro' : '🌙 Modo Escuro'}
    </button>
  )
}

export default ThemeToggle

