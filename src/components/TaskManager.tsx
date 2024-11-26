'use client'

import { useState, useEffect } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import { openDB } from 'idb'
import { useTheme } from '@/context/ThemeContext'

interface Task {
  id: IDBValidKey 
  title: string
  description: string
  priority: 'baixa' | 'média' | 'alta'
  status: 'pendente' | 'em progresso' | 'concluída'
}

const TaskManager = () => {
  const { darkMode } = useTheme()
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
    title: '',
    description: '',
    priority: 'média',
    status: 'pendente'
  })

  useEffect(() => {
    const loadTasks = async () => {
      const db = await openDB('taskIdeDB', 1, {
        upgrade(db) {
          db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true })
        },
      })
      const storedTasks = await db.getAll('tasks')
      setTasks(storedTasks.map(task => ({ ...task, id: Number(task.id) })))
    }
    loadTasks()
  }, [])

  const addTask = async () => {
    const db = await openDB('taskIdeDB', 1)
    const id = await db.add('tasks', newTask)
    setTasks([...tasks, { ...newTask, id: Number(id) }])
    setNewTask({ title: '', description: '', priority: 'média', status: 'pendente' })
  }

  const updateTask = async (updatedTask: Task) => {
    const db = await openDB('taskIdeDB', 1)
    await db.put('tasks', updatedTask)
    setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task))
  }

  const moveTask = (dragIndex: number, hoverIndex: number) => {
    const dragTask = tasks[dragIndex]
    setTasks(prevTasks => {
      const newTasks = [...prevTasks]
      newTasks.splice(dragIndex, 1)
      newTasks.splice(hoverIndex, 0, dragTask)
      return newTasks
    })
  }

  const TaskItem = ({ task, index }: { task: Task; index: number }) => {
    const [, drag] = useDrag({
      type: 'TASK',
      item: { index },
    })

    const [, drop] = useDrop({
      accept: 'TASK',
      hover: (item: { index: number }) => {
        if (item.index !== index) {
          moveTask(item.index, index)
          item.index = index
        }
      },
    })

    const combinedRef = (node: HTMLDivElement | null) => {
      drag(node)
      drop(node)
    }

    return (
      <div
        ref={combinedRef}
        className={`p-4 mb-2 rounded shadow ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}
      >
        <h3 className="font-bold">{task.title}</h3>
        <p>{task.description}</p>
        <select
          value={task.status}
          onChange={(e) => updateTask({ ...task, status: e.target.value as Task['status'] })}
          className={`mt-2 p-1 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        >
          <option value="pendente">Pendente</option>
          <option value="em progresso">Em Progresso</option>
          <option value="concluída">Concluída</option>
        </select>
      </div>
    )
  }

  return (
    <div className="w-1/2">
      <h2 className="text-2xl font-bold mb-4">Gerenciador de Tarefas</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Título da tarefa"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className={`w-full p-2 mb-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
        <textarea
          placeholder="Descrição da tarefa"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className={`w-full p-2 mb-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        />
        <select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
          className={`w-full p-2 mb-2 border rounded ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
        >
          <option value="baixa">Baixa</option>
          <option value="média">Média</option>
          <option value="alta">Alta</option>
        </select>
        <button onClick={addTask} className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Adicionar Tarefa
        </button>
      </div>
      <div>
        {tasks.map((task, index) => (
          <TaskItem key={task.id.toString()} task={task} index={index} />
        ))}
      </div>
    </div>
  )
}

export default TaskManager
