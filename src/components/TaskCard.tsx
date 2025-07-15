import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, User, Edit3 } from "lucide-react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  canEdit?: boolean;
}

const statusConfig = {
  todo: { 
    label: 'To Do', 
    className: 'bg-status-todo text-status-todo-foreground border-status-todo'
  },
  'in-progress': { 
    label: 'In Progress', 
    className: 'bg-status-in-progress text-status-in-progress-foreground border-status-in-progress'
  },
  review: { 
    label: 'Review', 
    className: 'bg-status-review text-status-review-foreground border-status-review'
  },
  done: { 
    label: 'Done', 
    className: 'bg-status-done text-status-done-foreground border-status-done'
  }
};

const priorityConfig = {
  low: { 
    label: 'Low', 
    className: 'bg-priority-low text-priority-low-foreground border-priority-low'
  },
  medium: { 
    label: 'Medium', 
    className: 'bg-priority-medium text-priority-medium-foreground border-priority-medium'
  },
  high: { 
    label: 'High', 
    className: 'bg-priority-high text-priority-high-foreground border-priority-high'
  },
  urgent: { 
    label: 'Urgent', 
    className: 'bg-priority-urgent text-priority-urgent-foreground border-priority-urgent animate-pulse'
  }
};

export function TaskCard({ task, onEdit, canEdit = true }: TaskCardProps) {
  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-gradient-to-br from-card via-card to-muted/30">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <h3 className="font-semibold text-foreground leading-tight truncate">{task.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
          </div>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="ml-2 h-8 w-8 p-0 hover:bg-primary/10"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className={cn("text-xs font-medium", statusConfig[task.status].className)}>
            {statusConfig[task.status].label}
          </Badge>
          <Badge variant="outline" className={cn("text-xs font-medium", priorityConfig[task.priority].className)}>
            {priorityConfig[task.priority].label}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="text-xs">Reporter:</span>
            <span className="font-medium text-foreground">{task.reporter.name}</span>
          </div>
          
          {task.assignee && (
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.assignee.name}`} />
                <AvatarFallback className="text-xs bg-primary/10">
                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">{task.assignee.name}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Updated {new Date(task.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}