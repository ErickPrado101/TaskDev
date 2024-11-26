'use client'

import { openDB } from 'idb'

const DataManager = () => {
  const exportData = async () => {
    const db = await openDB('taskIdeDB', 1)
    const tasks = await db.getAll('tasks')
    const code = await db.getAll('code')
    const data = { tasks, code }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'task-ide-export.json'
    a.click()
  }

  const importData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const text = await file.text()
      const data = JSON.parse(text)
      const db = await openDB('taskIdeDB', 1)
      await db.clear('tasks')
      await db.clear('code')
      for (const task of data.tasks) {
        await db.add('tasks', task)
      }
      for (const codeItem of data.code) {
        await db.put('code', codeItem)
      }
      alert('Dados importados com sucesso!')
      window.location.reload()
    }
  }

  return (
    <div className="mt-4">
      <button onClick={exportData} className="p-2 bg-blue-500 text-white rounded mr-2">
        Exportar Progresso
      </button>
      <input
        type="file"
        accept=".json"
        onChange={importData}
        className="p-2 bg-green-500 text-white rounded"
      />
    </div>
)
}

export default DataManager

