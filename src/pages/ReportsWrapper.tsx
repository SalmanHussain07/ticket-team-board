import React from 'react';
import Reports from './Reports';
import { Task, User, Project } from '@/types/task';
import { Product } from '@/types/product';

// Mock data for the reports page
const mockProducts: Product[] = [
  {
    id: '1',
    name: 'TaskFlow Platform',
    description: 'Main task management platform',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'Mobile companion app',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15')
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Core Features',
    description: 'Main platform features',
    productId: '1',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-01'),
    estimatedHours: 400,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Dashboard Redesign',
    description: 'New dashboard design',
    productId: '1',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-01'),
    estimatedHours: 300,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'iOS App',
    description: 'iOS mobile application',
    productId: '2',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-05-15'),
    estimatedHours: 600,
    createdAt: new Date('2024-01-15')
  }
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'manager',
    email: 'sarah@company.com'
  },
  {
    id: '2',
    name: 'Mike Chen',
    role: 'developer',
    email: 'mike@company.com'
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'developer',
    email: 'emily@company.com'
  }
];

const mockTasks: Task[] = [
  {
    id: '1',
    name: 'Implement user authentication',
    description: 'Add login and signup functionality',
    status: 'in-progress',
    priority: 'high',
    reporter: mockUsers[0],
    assignee: mockUsers[1],
    project: mockProjects[0],
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-15'),
    hours: 40,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-05')
  },
  {
    id: '2',
    name: 'Design task board',
    description: 'Create kanban board interface',
    status: 'done',
    priority: 'medium',
    reporter: mockUsers[0],
    assignee: mockUsers[2],
    project: mockProjects[0],
    startDate: new Date('2024-01-05'),
    endDate: new Date('2024-01-20'),
    hours: 32,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '3',
    name: 'Dashboard components',
    description: 'Build dashboard widgets',
    status: 'in-progress',
    priority: 'high',
    reporter: mockUsers[0],
    assignee: mockUsers[1],
    project: mockProjects[1],
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-20'),
    hours: 50,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-10')
  },
  {
    id: '4',
    name: 'iOS navigation',
    description: 'Implement app navigation',
    status: 'todo',
    priority: 'medium',
    reporter: mockUsers[0],
    assignee: mockUsers[2],
    project: mockProjects[2],
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-15'),
    hours: 24,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15')
  }
];

export default function ReportsWrapper() {
  return (
    <Reports
      tasks={mockTasks}
      users={mockUsers}
      projects={mockProjects}
      products={mockProducts}
    />
  );
}