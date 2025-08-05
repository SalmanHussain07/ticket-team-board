export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

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
  startDate: Date;
  endDate: Date;
  estimatedHours: number;
  createdAt: string;
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
  status: TaskStatus;
  priority: TaskPriority;
  assignor: string;
  assignorRole: string;
  assignee: string;
  assigneeId: string;
  project: string;
  startDate: Date;
  endDate: Date;
  hours: number;
  projectId: string;
  created_at: string;
  updated_at: string;

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