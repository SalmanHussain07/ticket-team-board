// import { useMemo } from "react";
// import { Task, TaskStatus, User } from "@/types/task";
// import { TaskCard } from "./TaskCard";
// import { Badge } from "@/components/ui/badge";
// import { cn } from "@/lib/utils";
// import {
//   DragDropContext,
//   Droppable,
//   Draggable,
//   DropResult,
// } from "@hello-pangea/dnd";

// interface KanbanBoardProps {
//   tasks: Task[];
//   onEditTask: (task: Task) => void;
//   onView: (task: Task) => void;
//   currentUser: User;
//   onStatusChange: (taskId: string, newStatus: TaskStatus) => void; // callback when status changes
// }

// const columns: { status: TaskStatus; title: string; description: string }[] = [
//   { status: "todo", title: "To Do", description: "Tasks ready to be started" },
//   { status: "in-progress", title: "In Progress", description: "Currently being worked on" },
//   { status: "review", title: "Review", description: "Awaiting review or testing" },
//   { status: "done", title: "Done", description: "Completed tasks" },
// ];

// const statusStyles = {
//   todo: "border-status-todo bg-status-todo/5",
//   "in-progress": "border-status-in-progress bg-status-in-progress/5",
//   review: "border-status-review bg-status-review/5",
//   done: "border-status-done bg-status-done/5",
// };

// export function KanbanBoard({ tasks, onEditTask, onView, currentUser, onStatusChange }: KanbanBoardProps) {
//   const tasksByStatus = useMemo(() => {
//     return columns.reduce((acc, column) => {
//       acc[column.status] = tasks.filter((task) => task.status === column.status);
//       return acc;
//     }, {} as Record<TaskStatus, Task[]>);
//   }, [tasks]);

//   const canEditTask = (task: Task) => {
//     if (["manager", "admin"].includes(currentUser.role)) return true;
//     if (currentUser.role === "developer") return true;
//     return false;
//   };

//   const handleDragEnd = (result: DropResult) => {
//     const { destination, source, draggableId } = result;
//     if (!destination) return;
//     if (
//       destination.droppableId === source.droppableId &&
//       destination.index === source.index
//     )
//       return;

//     const newStatus = destination.droppableId as TaskStatus;
//     onStatusChange(draggableId, newStatus);
//   };

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
//         {columns.map((column) => {
//           const columnTasks = tasksByStatus[column.status] || [];

//           return (
//             <Droppable key={column.status} droppableId={column.status}>
//               {(provided) => (
//                 <div
//                   ref={provided.innerRef}
//                   {...provided.droppableProps}
//                   className={cn(
//                     "flex flex-col rounded-lg border-2 border-dashed p-4 min-h-[500px]",
//                     statusStyles[column.status]
//                   )}
//                 >
//                   <div className="mb-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <h3 className="font-semibold text-lg text-foreground">
//                         {column.title}
//                       </h3>
//                       <Badge variant="secondary" className="text-xs">
//                         {columnTasks.length}
//                       </Badge>
//                     </div>
//                     <p className="text-sm text-muted-foreground mb-4">
//                       {column.description}
//                     </p>
//                   </div>

//                   <div className="space-y-3 flex-1">
//                     {columnTasks.length === 0 ? (
//                       <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
//                         No tasks in {column.title.toLowerCase()}
//                       </div>
//                     ) : (
//                       columnTasks.map((task, index) => (
//                         <Draggable
//                           key={task.id}
//                           draggableId={task.id}
//                           index={index}
//                         >
//                           {(providedDraggable) => (
//                             <div
//                               ref={providedDraggable.innerRef}
//                               {...providedDraggable.draggableProps}
//                               {...providedDraggable.dragHandleProps}
//                             >
//                               <TaskCard
//                                 task={task}
//                                 onEdit={onEditTask}
//                                 onView={onView}
//                                 canEdit={canEditTask(task)}
//                               />
//                             </div>
//                           )}
//                         </Draggable>
//                       ))
//                     )}
//                     {provided.placeholder}
//                   </div>
//                 </div>
//               )}
//             </Droppable>
//           );
//         })}
//       </div>
//     </DragDropContext>
//   );
// }



import { useEffect, useMemo, useState } from "react";
import { Column, KanbanColumn, Task, User} from "@/types/task";
import { TaskCard } from "./TaskCard";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { HttpClient } from "@/api/communicator";

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onView: (task: Task) => void;
  currentUser: User;
  onStatusChange: (taskId: string, newStatus: string) => void;
  columns: Column[]; // pass columns as a prop
}

// interface KanbanColumn {
//   status: string;
//   title: string;
//   description: string;
//   color: string;
// }

const statusStyles: Record<string, string> = {
  todo: "border-status-todo bg-status-todo/5",
  "in-progress": "border-status-in-progress bg-status-in-progress/5",
  review: "border-status-review bg-status-review/5",
  done: "border-status-done bg-status-done/5",
};

export function KanbanBoard({
  tasks,
  onEditTask,
  onView,
  currentUser,
  onStatusChange,
  columns, // use the passed columns prop
}: KanbanBoardProps) {
  // const [columns, setColumns] = useState<KanbanColumn[]>([]);

  const tasksByStatus = useMemo(() => {
    return columns.reduce((acc, column) => {
      acc[column.name] = tasks.filter((task) => task.status === column.name);
      return acc;
    }, {} as Record<string, Task[]>);
  }, [tasks, columns]);

  const canEditTask = (task: Task) => {
    if (["manager", "admin"].includes(currentUser.role)) return true;
    if (currentUser.role === "developer") return true;
    return false;
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId as string;
    onStatusChange(draggableId, newStatus);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {columns.map((column) => {
          const columnTasks = tasksByStatus[column.name] || [];

          return (
            <Droppable key={column.name} droppableId={column.name}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={cn(
                    "flex flex-col rounded-lg border-2 border-dashed p-4 min-h-[500px]"
                  )}
                   style={{ borderColor: column.color, backgroundColor: `${column.color}20`}}
                >
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg text-foreground">
                        {column.name}
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
                        No tasks in {column.name.toLowerCase()}
                      </div>
                    ) : (
                      columnTasks.map((task, index) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={index}
                        >
                          {(providedDraggable) => (
                            <div
                              ref={providedDraggable.innerRef}
                              {...providedDraggable.draggableProps}
                              {...providedDraggable.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                onEdit={onEditTask}
                                onView={onView}
                                canEdit={canEditTask(task)}
                                statusMeta={column}   // pass the column info (color, title, etc.)
                              />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          );
        })}
      </div>
    </DragDropContext>
  );
}
