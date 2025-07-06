"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export type FilterType = "all" | "completed" | "pending"

interface TaskFilterProps {
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  taskCounts: {
    all: number
    completed: number
    pending: number
  }
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function TaskFilter({ activeFilter, onFilterChange, taskCounts, searchQuery, onSearchChange }: TaskFilterProps) {
  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "All Tasks", count: taskCounts.all },
    { key: "pending", label: "Pending", count: taskCounts.pending },
    { key: "completed", label: "Completed", count: taskCounts.completed },
  ]

  return (
    <div className="space-y-4 mb-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            variant={activeFilter === filter.key ? "default" : "outline"}
            onClick={() => onFilterChange(filter.key)}
            className="flex items-center gap-2"
          >
            {filter.label}
            <Badge variant={activeFilter === filter.key ? "secondary" : "default"} className="ml-1">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  )
}
