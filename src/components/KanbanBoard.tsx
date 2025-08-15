import { useState, useMemo } from "react";
import { Task, TaskStatus, User } from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onView: (task: Task) => void;
  currentUser: User;
  onTaskStatusChange?: (taskId: string, newStatus: TaskStatus) => void;
}

interface SortableTaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onView: (task: Task) => void;
  canEdit: boolean;
}

function SortableTaskCard({ task, onEdit, onView, canEdit }: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onView={onView}
        canEdit={canEdit}
      />
    </div>
  );
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

export function KanbanBoard({ tasks, onEditTask, onView, currentUser, onTaskStatusChange }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
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

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    
    // Check if the task is being moved to a different column
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus && onTaskStatusChange) {
      onTaskStatusChange(taskId, newStatus);
    }
    
    setActiveTask(null);
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.status] || [];
          
          return (
            <div
              key={column.status}
              id={column.status}
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

              <SortableContext
                items={columnTasks.map(task => task.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3 flex-1">
                  {columnTasks.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                      No tasks in {column.title.toLowerCase()}
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <SortableTaskCard
                        key={task.id}
                        task={task}
                        onEdit={onEditTask}
                        onView={onView}
                        canEdit={canEditTask(task)}
                      />
                    ))
                  )}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
      
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            task={activeTask}
            onEdit={onEditTask}
            onView={onView}
            canEdit={canEditTask(activeTask)}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}