export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type UserRole = 'manager' | 'developer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  reporter: User;
  assignee: User | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
}