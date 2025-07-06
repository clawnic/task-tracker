"use client"

import { TaskItem } from "./TaskItem"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock } from "lucide-react"
import type { Task } from "../assignment/utils/localStorage"

interface TaskListProps {
  tasks: Task[]
  onToggleComplete: (id: number) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: number) => void
  searchQuery: string
}

export function TaskList({ tasks, onToggleComplete, onEditTask, onDeleteTask, searchQuery }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            {searchQuery ? (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
                  <p className="text-gray-500">No tasks match your search for "{searchQuery}"</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks yet</h3>
                  <p className="text-gray-500">Get started by adding your first task!</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </div>
  )
}
