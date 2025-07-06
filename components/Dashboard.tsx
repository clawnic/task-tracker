"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, User } from "lucide-react"
import { TaskForm } from "./TaskForm"
import { TaskList } from "./TaskList"
import { TaskFilter, type FilterType } from "./TaskFilter"
import { saveToLocalStorage, STORAGE_KEYS, initializeFromStorage, type Task } from "../utils/localStorage"

interface DashboardProps {
  username: string
  onLogout: () => void
}

export function Dashboard({ username, onLogout }: DashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(() => initializeFromStorage(STORAGE_KEYS.TASKS, []))
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.TASKS, tasks)
  }, [tasks])

  // Filter and search tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks

    // Apply filter
    if (activeFilter === "completed") {
      filtered = filtered.filter((task) => task.completed)
    } else if (activeFilter === "pending") {
      filtered = filtered.filter((task) => !task.completed)
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (task) => task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query),
      )
    }

    // Sort by creation date (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [tasks, activeFilter, searchQuery])

  // Calculate task counts
  const taskCounts = useMemo(
    () => ({
      all: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      pending: tasks.filter((task) => !task.completed).length,
    }),
    [tasks],
  )

  const handleAddTask = (taskData: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(), // Simple ID generation
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks((prev) => prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)))
    setEditingTask(null)
  }

  const handleDeleteTask = (taskId: number) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    if (editingTask?.id === taskId) {
      setEditingTask(null)
    }
  }

  const handleToggleComplete = (taskId: number) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  const handleCancelEdit = () => {
    setEditingTask(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Welcome back, {username}!</h1>
                <p className="text-sm text-gray-500">Manage your personal tasks</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Tasks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{taskCounts.all}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{taskCounts.completed}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{taskCounts.pending}</div>
            </CardContent>
          </Card>
        </div>

        {/* Task Form */}
        <TaskForm
          onAddTask={handleAddTask}
          editingTask={editingTask}
          onUpdateTask={handleUpdateTask}
          onCancelEdit={handleCancelEdit}
        />

        {/* Task Filter */}
        <TaskFilter
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          taskCounts={taskCounts}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  )
}
