"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Plus, X } from "lucide-react"
import type { Task } from "../utils/localStorage"

interface TaskFormProps {
  onAddTask: (task: Omit<Task, "id" | "createdAt">) => void
  editingTask?: Task | null
  onUpdateTask?: (task: Task) => void
  onCancelEdit?: () => void
}

export function TaskForm({ onAddTask, editingTask, onUpdateTask, onCancelEdit }: TaskFormProps) {
  const [title, setTitle] = useState(editingTask?.title || "")
  const [description, setDescription] = useState(editingTask?.description || "")
  const [error, setError] = useState("")
  const [isExpanded, setIsExpanded] = useState(!!editingTask)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError("Task title is required")
      return
    }

    if (editingTask && onUpdateTask) {
      onUpdateTask({
        ...editingTask,
        title: title.trim(),
        description: description.trim(),
      })
    } else {
      onAddTask({
        title: title.trim(),
        description: description.trim(),
        completed: false,
      })
    }

    // Reset form
    setTitle("")
    setDescription("")
    setError("")
    setIsExpanded(false)
  }

  const handleCancel = () => {
    setTitle(editingTask?.title || "")
    setDescription(editingTask?.description || "")
    setError("")
    if (editingTask && onCancelEdit) {
      onCancelEdit()
    } else {
      setIsExpanded(false)
    }
  }

  if (!isExpanded && !editingTask) {
    return (
      <Button onClick={() => setIsExpanded(true)} className="w-full mb-6" size="lg">
        <Plus className="w-4 h-4 mr-2" />
        Add New Task
      </Button>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{editingTask ? "Edit Task" : "Add New Task"}</CardTitle>
          {!editingTask && (
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter task title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                setError("")
              }}
              className={error ? "border-red-500" : ""}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter task description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {editingTask ? "Update Task" : "Add Task"}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
