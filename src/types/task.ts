export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type UserRole = 'manager' | 'developer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  createdAt: Date;
}

export interface Task {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  reporter: User;
  assignee: User | null;
  project: Project;
  startDate: Date;
  endDate: Date;
  hours: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFormData {
  name: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string | null;
  projectId: string;
  startDate: Date;
  endDate: Date;
  hours: number;
}

export interface Holiday {
  id: string;
  name: string;
  date: Date;
}

export interface HolidayFormData {
  name: string;
  date: Date;
}