import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Task } from "@/types/task";
import { differenceInDays } from "date-fns";

interface DueDateAlertProps {
  tasks: Task[];
}

export function DueDateAlert({ tasks }: DueDateAlertProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const urgentTasks = tasks.filter(task => {
    const daysUntilDue = differenceInDays(task.endDate, new Date());
    const isOverdue = daysUntilDue < 0 && task.status !== 'done';
    const isDueSoon = daysUntilDue <= 2 && daysUntilDue >= 0 && task.status !== 'done';
    
    return (isOverdue || isDueSoon) && !dismissedAlerts.includes(task.id);
  });

  const handleDismiss = (taskId: string) => {
    setDismissedAlerts(prev => [...prev, taskId]);
  };

  if (urgentTasks.length === 0) return null;

  return (
    <div className="space-y-2 mb-6">
      {urgentTasks.slice(0, 3).map(task => {
        const daysUntilDue = differenceInDays(task.endDate, new Date());
        const isOverdue = daysUntilDue < 0;
        
        return (
          <Alert key={task.id} variant={isOverdue ? "destructive" : "default"} className="relative">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="pr-8">
              <strong>{task.name}</strong> is {isOverdue ? `overdue by ${Math.abs(daysUntilDue)} day(s)` : `due in ${daysUntilDue} day(s)`}
            </AlertDescription>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDismiss(task.id)}
              className="absolute right-2 top-2 h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </Alert>
        );
      })}
    </div>
  );
}