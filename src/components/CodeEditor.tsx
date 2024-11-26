'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { openDB } from 'idb'
import { useTheme } from '@/context/ThemeContext'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

const CodeEditor = () => {
  const [code, setCode] = useState('')
  const [language, setLanguage] = useState('javascript')
  const { darkMode } = useTheme()

  useEffect(() => {
    const loadCode = async () => {
      const db = await openDB('taskIdeDB', 1, {
        upgrade(db) {
          db.createObjectStore('code', { keyPath: 'language' })
        },
      })
      const storedCode = await db.get('code', language)
      if (storedCode) {
        setCode(storedCode.content)
      }
    }
    loadCode()
  }, [language])

  const handleEditorChange = async (value: string | undefined) => {
    if (value !== undefined) {
      setCode(value)
      const db = await openDB('taskIdeDB', 1)
      await db.put('code', { language, content: value })
    }
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value)
  }

  const previewCode = () => {
    if (language === 'javascript') {
      try {
        // Executar o código JavaScript em um ambiente seguro
        const result = new Function(code)()
        console.log('Resultado da execução:', result)
      } catch (error) {
        console.error('Erro ao executar o código:', error)
      }
    } else if (language === 'python') {
      console.log('Pré-visualização de Python não implementada no navegador')
    }
  }

  return (
    <div className="w-1/2">
      <h2 className="text-2xl font-bold mb-4">Editor de Código</h2>
      <select
        value={language}
        onChange={handleLanguageChange}
        className={`w-full p-2 mb-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="typescript">TypeScript</option>
      </select>
      <MonacoEditor
        height="400px"
        language={language}
        theme={darkMode ? 'vs-dark' : 'vs-light'}
        value={code}
        onChange={handleEditorChange}
      />
      <button onClick={previewCode} className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600">
        Pré-visualizar
      </button>
    </div>
  )
}

export default CodeEditor

