import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calendar, User, Edit3, AlertTriangle } from "lucide-react";
import { Task } from "@/types/task";
import { cn } from "@/lib/utils";
import { differenceInDays } from "date-fns";

interface CompactTaskCardProps {
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

export function CompactTaskCard({ task, onEdit, canEdit = true }: CompactTaskCardProps) {
  const daysUntilDue = differenceInDays(task.endDate, new Date());
  const isOverdue = daysUntilDue < 0 && task.status !== 'done';
  const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0 && task.status !== 'done';

  return (
    <Card className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01] bg-gradient-to-br from-card via-card to-muted/20">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-sm text-foreground leading-tight truncate">{task.name}</h3>
              {(isOverdue || isDueSoon) && (
                <AlertTriangle className={cn("h-3 w-3 flex-shrink-0", 
                  isOverdue ? "text-destructive" : "text-orange-500"
                )} />
              )}
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">{task.description}</p>
          </div>
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="ml-2 h-6 w-6 p-0 hover:bg-primary/10 flex-shrink-0"
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 pt-0">
        <div className="flex flex-wrap gap-1">
          <Badge variant="secondary" className={cn("text-xs font-medium px-1.5 py-0.5", statusConfig[task.status].className)}>
            {statusConfig[task.status].label}
          </Badge>
          <Badge variant="outline" className={cn("text-xs font-medium px-1.5 py-0.5", priorityConfig[task.priority].className)}>
            {priorityConfig[task.priority].label}
          </Badge>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Project:</span>
            <span className="font-medium text-foreground truncate max-w-[120px]">{task.project.name}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Due:</span>
            <span className={cn("font-medium", 
              isOverdue ? "text-destructive" : isDueSoon ? "text-orange-500" : "text-foreground"
            )}>
              {task.endDate.toLocaleDateString()}
            </span>
          </div>
          
          {task.assignee && (
            <div className="flex items-center gap-1.5">
              <Avatar className="h-4 w-4">
                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.assignee.name}`} />
                <AvatarFallback className="text-xs bg-primary/10">
                  {task.assignee.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium text-foreground truncate">{task.assignee.name}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}