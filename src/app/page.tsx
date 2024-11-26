'use client'

import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import TaskManager from '../components/TaskManager'
import CodeEditor from '../components/CodeEditor'
import ThemeToggle from '../components/ThemeToggle'
import DataManager from '../components/DataManager'
import { useTheme } from '@/context/ThemeContext'

export default function Home() {
  const { darkMode } = useTheme()

  return (
    <DndProvider backend={HTML5Backend}>
      <main className={`flex min-h-screen flex-col items-center justify-between p-24 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Task IDE</h1>
            <ThemeToggle />
          </div>
          <div className="flex space-x-4">
            <TaskManager />
            <CodeEditor />
          </div>
          <DataManager />
        </div>
      </main>
    </DndProvider>
  )
}

