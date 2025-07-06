"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Edit2, Trash2, Calendar } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { Task } from "../utils/localStorage"
interface TaskItemProps {
  task: Task
  onToggleComplete: (id: number) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (id: number) => void
}

export function TaskItem({ task, onToggleComplete, onEditTask, onDeleteTask }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleDelete = () => {
    setIsDeleting(true)
    onDeleteTask(task.id)
  }

  return (
    <Card
      className={`transition-all duration-200 ${task.completed ? "opacity-75 bg-gray-50" : "bg-white"} ${isDeleting ? "opacity-50" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox checked={task.completed} onCheckedChange={() => onToggleComplete(task.id)} className="mt-1" />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className={`font-medium text-gray-900 ${task.completed ? "line-through text-gray-500" : ""}`}>
                {task.title}
              </h3>
              <div className="flex items-center gap-1">
                <Badge variant={task.completed ? "secondary" : "default"}>
                  {task.completed ? "Completed" : "Pending"}
                </Badge>
              </div>
            </div>

            {task.description && (
              <p className={`text-sm text-gray-600 mt-1 ${task.completed ? "line-through" : ""}`}>{task.description}</p>
            )}

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Calendar className="w-3 h-3" />
                {formatDate(task.createdAt)}
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => onEditTask(task)} disabled={isDeleting}>
                  <Edit2 className="w-3 h-3" />
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Task</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{task.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
