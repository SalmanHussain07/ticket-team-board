import { useState, useMemo } from "react";
import { Task, TaskStatus, User } from "@/types/task";
import { CompactTaskCard } from "./CompactTaskCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onUpdateTask: (taskId: string, status: TaskStatus) => void;
  currentUser: User;
}

interface SortableTaskProps {
  task: Task;
  onEdit: (task: Task) => void;
  canEdit: boolean;
}

function SortableTask({ task, onEdit, canEdit }: SortableTaskProps) {
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
      <CompactTaskCard task={task} onEdit={onEdit} canEdit={canEdit} />
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

export function KanbanBoard({ tasks, onEditTask, onUpdateTask, currentUser }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const tasksByStatus = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.status] = tasks.filter(task => task.status === column.status);
      return acc;
    }, {} as Record<TaskStatus, Task[]>);
  }, [tasks]);

  const canEditTask = (task: Task) => {
    if (currentUser.role === 'manager') return true;
    if (currentUser.role === 'developer') return true; // Can edit status and assignee
    return false;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find(t => t.id === taskId);

    if (task && task.status !== newStatus) {
      onUpdateTask(taskId, newStatus);
    }
  };

  return (
    <DndContext
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.status] || [];
          
          return (
            <SortableContext
              key={column.status}
              items={columnTasks.map(task => task.id)}
              strategy={verticalListSortingStrategy}
            >
              <div
                id={column.status}
                className={cn(
                  "flex flex-col rounded-lg border-2 border-dashed p-4 min-h-[500px] max-h-[700px]",
                  statusStyles[column.status]
                )}
              >
                <div className="mb-4 flex-shrink-0">
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

                <div className="space-y-3 flex-1 overflow-y-auto">
                  {columnTasks.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                      No tasks in {column.title.toLowerCase()}
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        onEdit={onEditTask}
                        canEdit={canEditTask(task)}
                      />
                    ))
                  )}
                </div>
              </div>
            </SortableContext>
          );
        })}
      </div>
      
      <DragOverlay>
        {activeTask ? (
          <CompactTaskCard 
            task={activeTask} 
            onEdit={() => {}} 
            canEdit={false} 
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}