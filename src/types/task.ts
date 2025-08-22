// export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Column {
  id: number;
  name: string;
  description: string;
  color: string; // e.g., "bg-blue-500"
}
// export type UserRole = 'admin' | 'manager' | 'developer';

export interface UserRole {
  id: number;
  name: string;  // e.g., "admin"
}

// export interface User {
//   id: string;
//   name: string;
//   role: UserRole;
//   email: string;
// }

export interface User {
  id: string;
  name: string;
  full_name: string;
  role: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  productId: string;
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
}

// export interface Task {
//   id: string;
//   name: string;
//   description: string;
//   status: TaskStatus;
//   priority: TaskPriority;
//   reporter: User;
//   assignee: User | null;
//   project: Project;
//   createdAt: Date;
//   updatedAt: Date;
// }

export interface Task {
  id: string;
  name: string;
  description: string;
  status: string;
  priority: TaskPriority;
  assignor: string;
  assignorRole: string;
  assignee: string;
  assigneeId: string;
  project: string;
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  projectId: string;
  created_at: Date;
  updated_at: Date;
  project_start: Date;
  project_end: Date;
  assigneeRole: string;
  assignorId: string;

}

export interface KanbanColumn {
  status: string;
  title: string;
  description: string;
  color: string;
}

export interface TaskFormData {
  name: string;
  description: string;
  status: string;
  priority: TaskPriority;
  assigneeId: string | null;
  projectId: string;
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
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