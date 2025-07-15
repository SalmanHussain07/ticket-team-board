import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Task, TaskFormData, TaskStatus, TaskPriority, User, UserRole } from "@/types/task";
import { Save, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskFormData) => void;
  currentUser: User;
  availableUsers: User[];
  isCreating?: boolean;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' }
];

const priorityOptions: { value: TaskPriority; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' }
];

export function TaskModal({ 
  task, 
  isOpen, 
  onClose, 
  onSave, 
  currentUser, 
  availableUsers,
  isCreating = false 
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assigneeId: null
  });

  const [errors, setErrors] = useState<Partial<TaskFormData>>({});

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigneeId: task.assignee?.id || null
      });
    } else if (isCreating) {
      setFormData({
        name: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assigneeId: null
      });
    }
    setErrors({});
  }, [task, isCreating, isOpen]);

  const canEditAllFields = currentUser.role === 'manager';
  const canEditLimitedFields = currentUser.role === 'developer';

  const validateForm = (): boolean => {
    const newErrors: Partial<TaskFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Task name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    onSave(formData);
    onClose();
  };

  const canEdit = (field: keyof TaskFormData): boolean => {
    if (canEditAllFields) return true;
    if (canEditLimitedFields && (field === 'status' || field === 'assigneeId')) return true;
    return false;
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isCreating ? 'Create New Task' : 'Edit Task'}
            {task && (
              <Badge variant="outline" className="ml-auto">
                ID: {task.id}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Task Name *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              disabled={!canEdit('name')}
              className={cn(errors.name && "border-destructive")}
              placeholder="Enter task name..."
            />
            {errors.name && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              disabled={!canEdit('description')}
              className={cn("min-h-[100px]", errors.description && "border-destructive")}
              placeholder="Describe the task in detail..."
            />
            {errors.description && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: TaskStatus) => setFormData(prev => ({ ...prev, status: value }))}
                disabled={!canEdit('status')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) => setFormData(prev => ({ ...prev, priority: value }))}
                disabled={!canEdit('priority')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-2 h-2 rounded-full",
                          option.value === 'low' && "bg-priority-low",
                          option.value === 'medium' && "bg-priority-medium",
                          option.value === 'high' && "bg-priority-high",
                          option.value === 'urgent' && "bg-priority-urgent"
                        )} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignee */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Assignee</Label>
            <Select
              value={formData.assigneeId || ''}
              onValueChange={(value) => setFormData(prev => ({ ...prev, assigneeId: value || null }))}
              disabled={!canEdit('assigneeId')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select assignee..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">
                  <span className="text-muted-foreground">Unassigned</span>
                </SelectItem>
                {availableUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                        <AvatarFallback className="text-xs">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {user.role}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reporter (read-only) */}
          {task && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Reporter</Label>
              <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.reporter.name}`} />
                  <AvatarFallback className="text-xs">
                    {task.reporter.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{task.reporter.name}</span>
                <Badge variant="outline" className="text-xs">
                  {task.reporter.role}
                </Badge>
              </div>
            </div>
          )}

          {/* Role-based permissions notice */}
          {!canEditAllFields && (
            <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Developer Role:</strong> You can only edit Status and Assignee fields.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={Object.keys(errors).length > 0}>
            <Save className="w-4 h-4 mr-2" />
            {isCreating ? 'Create Task' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}