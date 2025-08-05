import { useState, useMemo } from "react";
import { Task, TaskStatus, User } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  currentUser: User;
}

const columns: { status: TaskStatus; title: string; description: string }[] = [
  { 
    status: 'todo', 
    title: 'To Do', 
    description: 'Tasks ready to be started' 
  },
  { 
    status: 'in-progress', 
    title: 'In Progress', 
    description: 'Currently being worked on' 
  },
  { 
    status: 'review', 
    title: 'Review', 
    description: 'Awaiting review or testing' 
  },
  { 
    status: 'done', 
    title: 'Done', 
    description: 'Completed tasks' 
  }
];

const statusStyles = {
  todo: "border-status-todo bg-status-todo/5",
  'in-progress': "border-status-in-progress bg-status-in-progress/5",
  review: "border-status-review bg-status-review/5",
  done: "border-status-done bg-status-done/5"
};

export function KanbanBoard({ tasks, onEditTask, currentUser }: KanbanBoardProps) {
  const tasksByStatus = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.status] = tasks.filter(task => task.status === column.status);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  const canEditTask = (task: Task) => {
    if (['manager', 'admin'].includes(currentUser.role)) return true;
    if (currentUser.role === 'developer') return true; // Can edit status and assignee
    return false;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
      {columns.map((column) => {
        const columnTasks = tasksByStatus[column.status] || [];
        
        return (
          <div
            key={column.status}
            className={cn(
              "flex flex-col rounded-lg border-2 border-dashed p-4 min-h-[500px]",
              statusStyles[column.status]
            )}
          >
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg text-foreground">
                  {column.title}
                </h3>
                <Badge variant="secondary" className="text-xs">
                  {columnTasks.length}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {column.description}
              </p>
            </div>

            <div className="space-y-3 flex-1">
              {columnTasks.length === 0 ? (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                  No tasks in {column.title.toLowerCase()}
                </div>
              ) : (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEditTask}
                    canEdit={canEditTask(task)}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}