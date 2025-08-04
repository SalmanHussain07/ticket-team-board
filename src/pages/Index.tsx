import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import { UserModal, UserFormData } from "@/components/UserModal";
import { ProjectModal, ProjectFormData } from "@/components/ProjectModal";
import { UserSelector } from "@/components/UserSelector";
import { Reports } from "@/components/Reports";
import { TaskCard } from "@/components/TaskCard";
import { Task, TaskFormData, User, Project, Holiday, HolidayFormData } from "@/types/task";
import { HolidayModal } from "@/components/HolidayModal";
import { Plus, BarChart3, Calendar, Users, TrendingUp, AlertTriangle, UserPlus, Edit, Trash2, FolderPlus, LogOut, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
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
  },
  {
    id: '4',
    name: 'Alex Kim',
    role: 'developer',
    email: 'alex@company.com'
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'E-commerce Platform',
    description: 'Main e-commerce platform development',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-06-30'),
    estimatedHours: 960,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'Mobile application for customers',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-08-31'),
    estimatedHours: 1120,
    createdAt: new Date('2024-01-05')
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Internal analytics and reporting dashboard',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-09-30'),
    estimatedHours: 1040,
    createdAt: new Date('2024-01-10')
  }
];

const mockHolidays: Holiday[] = [
  {
    id: '1',
    name: 'New Year Day',
    date: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Independence Day',
    date: new Date('2024-08-15')
  }
];

const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    name: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens and secure password hashing.',
    status: 'in-progress',
    priority: 'high',
    reporter: mockUsers[0],
    assignee: mockUsers[1],
    project: mockProjects[0],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  },
  {
    id: 'TASK-002',
    name: 'Design responsive dashboard',
    description: 'Create a mobile-friendly dashboard with charts and data visualization components.',
    status: 'todo',
    priority: 'medium',
    reporter: mockUsers[0],
    assignee: mockUsers[2],
    project: mockProjects[2],
    createdAt: new Date('2024-01-11'),
    updatedAt: new Date('2024-01-11')
  },
  {
    id: 'TASK-003',
    name: 'Fix production bug #247',
    description: 'Resolve critical bug causing API timeouts in production environment.',
    status: 'review',
    priority: 'urgent',
    reporter: mockUsers[1],
    assignee: mockUsers[3],
    project: mockProjects[0],
    createdAt: new Date('2024-01-09'),
    updatedAt: new Date('2024-01-13')
  },
  {
    id: 'TASK-004',
    name: 'Update documentation',
    description: 'Refresh API documentation and add examples for new endpoints.',
    status: 'done',
    priority: 'low',
    reporter: mockUsers[0],
    assignee: mockUsers[2],
    project: mockProjects[1],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-10')
  },
  {
    id: 'TASK-005',
    name: 'Performance optimization',
    description: 'Optimize database queries and implement caching for better performance.',
    status: 'todo',
    priority: 'medium',
    reporter: mockUsers[0],
    assignee: null,
    project: mockProjects[0],
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  }
];

export default function Index() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [taskSearch, setTaskSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [projectSearch, setProjectSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [savingTask, setSavingTask] = useState(false);
  const [savingUser, setSavingUser] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [deletingUser, setDeletingUser] = useState<string | null>(null);
  const [deletingProject, setDeletingProject] = useState<string | null>(null);
  const { toast } = useToast();

  // Simulate initial data loading
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setTasks(mockTasks);
      setUsers(mockUsers);
      setProjects(mockProjects);
      setHolidays(mockHolidays);
      setCurrentUser(mockUsers[0]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  const taskStats = useMemo(() => {
    const total = tasks.length;
    const byStatus = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const byPriority = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      byStatus,
      byPriority,
      assigned: tasks.filter(t => t.assignee).length,
      unassigned: tasks.filter(t => !t.assignee).length
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => 
      task.name.toLowerCase().includes(taskSearch.toLowerCase()) ||
      task.description.toLowerCase().includes(taskSearch.toLowerCase()) ||
      task.id.toLowerCase().includes(taskSearch.toLowerCase())
    );
  }, [tasks, taskSearch]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.role.toLowerCase().includes(userSearch.toLowerCase())
    );
  }, [users, userSearch]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => 
      project.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
      project.description.toLowerCase().includes(projectSearch.toLowerCase())
    );
  }, [projects, projectSearch]);

  const handleCreateTask = () => {
    if (currentUser.role !== 'manager') {
      toast({
        title: "Access Denied",
        description: "Only managers can create new tasks.",
        variant: "destructive"
      });
      return;
    }
    setSelectedTask(null);
    setIsCreatingTask(true);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setIsCreatingTask(false);
    setIsTaskModalOpen(true);
  };

  const handleSaveTask = async (taskData: TaskFormData) => {
    if (!currentUser) return;
    
    setSavingTask(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isCreatingTask) {
        // Creating a new task
        const newTask: Task = {
          id: `task-${Date.now()}`,
          name: taskData.name,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          reporter: currentUser,
          assignee: taskData.assigneeId ? users.find(u => u.id === taskData.assigneeId) || null : null,
          project: projects.find(p => p.id === taskData.projectId) || projects[0],
          startDate: taskData.startDate,
          endDate: taskData.endDate,
          hours: taskData.hours,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        setTasks(prev => [...prev, newTask]);
        toast({
          title: "Task created successfully",
          description: `"${newTask.name}" has been created.`,
        });
      } else if (selectedTask) {
        // Editing existing task
        const updatedTask: Task = {
          ...selectedTask,
          name: taskData.name,
          description: taskData.description,
          status: taskData.status,
          priority: taskData.priority,
          assignee: taskData.assigneeId ? users.find(u => u.id === taskData.assigneeId) || null : null,
          project: projects.find(p => p.id === taskData.projectId) || selectedTask.project,
          updatedAt: new Date()
        };
        setTasks(prev => prev.map(task => task.id === selectedTask.id ? updatedTask : task));
        toast({
          title: "Task updated successfully",
          description: `"${updatedTask.name}" has been updated.`,
        });
      }
    } finally {
      setSavingTask(false);
      setIsTaskModalOpen(false);
      setSelectedTask(null);
      setIsCreatingTask(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsCreatingUser(true);
    setIsUserModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsCreatingUser(false);
    setIsUserModalOpen(true);
  };

  const handleDeleteUser = async (user: User) => {
    if (!currentUser || user.id === currentUser.id) {
      toast({
        title: "Cannot delete current user",
        description: "You cannot delete the user you are currently logged in as.",
        variant: "destructive",
      });
      return;
    }
    
    setDeletingUser(user.id);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setUsers(prev => prev.filter(u => u.id !== user.id));
      // Remove user from tasks as assignee
      setTasks(prev => prev.map(task => 
        task.assignee?.id === user.id 
          ? { ...task, assignee: null, updatedAt: new Date() }
          : task
      ));
      toast({
        title: "User deleted successfully",
        description: `"${user.name}" has been removed.`,
      });
    } finally {
      setDeletingUser(null);
    }
  };

  const confirmDeleteUser = (user: User) => {
    handleDeleteUser(user);
  };

  const handleSaveUser = async (userData: UserFormData) => {
    if (!currentUser) return;
    
    setSavingUser(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isCreatingUser) {
        // Creating a new user
        const newUser: User = {
          id: `user-${Date.now()}`,
          name: userData.name,
          email: userData.email,
          role: userData.role
        };
        setUsers(prev => [...prev, newUser]);
        toast({
          title: "User created successfully",
          description: `"${newUser.name}" has been created.`,
        });
      } else if (selectedUser) {
        // Editing existing user
        const updatedUser: User = {
          ...selectedUser,
          name: userData.name,
          email: userData.email,
          role: userData.role
        };
        setUsers(prev => prev.map(user => user.id === selectedUser.id ? updatedUser : user));
        
        // Update current user if editing themselves
        if (selectedUser.id === currentUser.id) {
          setCurrentUser(updatedUser);
        }
        
        // Update tasks that reference this user
        setTasks(prev => prev.map(task => {
          const updatedTask = { ...task };
          if (task.reporter.id === selectedUser.id) {
            updatedTask.reporter = updatedUser;
          }
          if (task.assignee?.id === selectedUser.id) {
            updatedTask.assignee = updatedUser;
          }
          return updatedTask;
        }));
        
        toast({
          title: "User updated successfully",
          description: `"${updatedUser.name}" has been updated.`,
        });
      }
    } finally {
      setSavingUser(false);
      setIsUserModalOpen(false);
      setSelectedUser(null);
      setIsCreatingUser(false);
    }
  };

  const handleCreateProject = () => {
    setSelectedProject(null);
    setIsCreatingProject(true);
    setIsProjectModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsCreatingProject(false);
    setIsProjectModalOpen(true);
  };

  const handleDeleteProject = async (project: Project) => {
    // Check if project has tasks
    const projectTasks = tasks.filter(task => task.project.id === project.id);
    if (projectTasks.length > 0) {
      toast({
        title: "Cannot delete project",
        description: `This project has ${projectTasks.length} task(s). Please reassign or delete them first.`,
        variant: "destructive",
      });
      return;
    }
    
    setDeletingProject(project.id);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setProjects(prev => prev.filter(p => p.id !== project.id));
      toast({
        title: "Project deleted successfully",
        description: `"${project.name}" has been removed.`,
      });
    } finally {
      setDeletingProject(null);
    }
  };

  const confirmDeleteProject = (project: Project) => {
    handleDeleteProject(project);
  };

  const handleSaveProject = async (projectData: ProjectFormData) => {
    setSavingProject(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (isCreatingProject) {
        // Creating a new project
        const newProject: Project = {
          id: `project-${Date.now()}`,
          name: projectData.name,
          description: projectData.description,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          estimatedHours: projectData.estimatedHours,
          createdAt: new Date()
        };
        setProjects(prev => [...prev, newProject]);
        toast({
          title: "Project created successfully",
          description: `"${newProject.name}" has been created.`,
        });
      } else if (selectedProject) {
        // Editing existing project
        const updatedProject: Project = {
          ...selectedProject,
          name: projectData.name,
          description: projectData.description,
          startDate: projectData.startDate,
          endDate: projectData.endDate,
          estimatedHours: projectData.estimatedHours
        };
        setProjects(prev => prev.map(project => project.id === selectedProject.id ? updatedProject : project));
        
        // Update tasks that reference this project
        setTasks(prev => prev.map(task => 
          task.project.id === selectedProject.id 
            ? { ...task, project: updatedProject, updatedAt: new Date() }
            : task
        ));
        
        toast({
          title: "Project updated successfully",
          description: `"${updatedProject.name}" has been updated.`,
        });
      }
    } finally {
      setSavingProject(false);
      setIsProjectModalOpen(false);
      setSelectedProject(null);
      setIsCreatingProject(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Task Management</h1>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Task Management</h1>
            </div>
            <div className="flex items-center gap-4">
              {currentUser && (
                <UserSelector
                  users={users}
                  selectedUserId={currentUser.id}
                  onSelect={(userId) => {
                    const user = users.find(u => u.id === userId);
                    if (user) setCurrentUser(user);
                  }}
                />
              )}
              {currentUser?.role === 'manager' && (
                <Button onClick={handleCreateTask} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => window.location.href = '/login'}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="kanban" className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="holidays">Holidays</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="space-y-4">
            <KanbanBoard 
              tasks={tasks}
              currentUser={currentUser}
              onEditTask={handleEditTask}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={taskSearch}
                onChange={(e) => setTaskSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {taskSearch ? 'No tasks found matching your search.' : 'No tasks available.'}
                </div>
              ) : (
                filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    canEdit={true}
                  />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Assigned</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.assigned}</div>
                  <p className="text-xs text-muted-foreground">
                    {taskStats.unassigned} unassigned
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.byStatus['in-progress'] || 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.byStatus.done || 0}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tasks by Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(taskStats.byStatus).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="capitalize">{status.replace('-', ' ')}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${(count / taskStats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Priority Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(taskStats.byPriority).map(([priority, count]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <span className="capitalize">{priority}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-muted rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-primary"
                            style={{ width: `${(count / taskStats.total) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-8">{count}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Reports 
              tasks={tasks}
              users={users}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button onClick={handleCreateUser} className="gap-2">
                <UserPlus className="h-4 w-4" />
                Add User
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="grid gap-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {userSearch ? 'No users found matching your search.' : 'No users available.'}
                </div>
              ) : (
                filteredUsers.map(user => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} />
                            <AvatarFallback className="text-sm">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={user.role === 'manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                            {user.role}
                          </Badge>
                          {currentUser && user.id === currentUser.id && (
                            <Badge variant="secondary">Current</Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                            disabled={deletingUser === user.id}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                disabled={currentUser && user.id === currentUser.id || deletingUser === user.id}
                              >
                                {deletingUser === user.id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the user "{user.name}" and remove them from all assigned tasks.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => confirmDeleteUser(user)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Project Management</h2>
              <Button onClick={handleCreateProject} className="gap-2">
                <FolderPlus className="h-4 w-4" />
                Add Project
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
            
            <div className="grid gap-4">
              {filteredProjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {projectSearch ? 'No projects found matching your search.' : 'No projects available.'}
                </div>
              ) : (
                filteredProjects.map(project => (
                  <Card key={project.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-lg">{project.name}</h3>
                              <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                <span>Created: {project.createdAt.toLocaleDateString()}</span>
                                <span>Tasks: {tasks.filter(t => t.project.id === project.id).length}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProject(project)}
                                disabled={deletingProject === project.id}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                    disabled={deletingProject === project.id}
                                  >
                                    {deletingProject === project.id ? (
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                                    ) : (
                                      <Trash2 className="h-4 w-4" />
                                    )}
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the project "{project.name}". {tasks.filter(t => t.project.id === project.id).length > 0 ? 'This project has tasks assigned to it and cannot be deleted.' : ''}
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => confirmDeleteProject(project)}
                                      disabled={tasks.filter(t => t.project.id === project.id).length > 0}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="holidays" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gazetted Holidays</h2>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Holiday
              </Button>
            </div>
            
            <div className="grid gap-4">
              {holidays.map(holiday => (
                <Card key={holiday.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{holiday.name}</h3>
                        <p className="text-sm text-muted-foreground">{holiday.date.toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {currentUser && (
        <TaskModal
          task={selectedTask}
          isOpen={isTaskModalOpen}
          onClose={() => {
            if (!savingTask) {
              setIsTaskModalOpen(false);
              setSelectedTask(null);
              setIsCreatingTask(false);
            }
          }}
          onSave={handleSaveTask}
          currentUser={currentUser}
          availableUsers={users}
          availableProjects={projects}
          holidays={holidays}
          isCreating={isCreatingTask}
          isSaving={savingTask}
        />
      )}

      <UserModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={() => {
          if (!savingUser) {
            setIsUserModalOpen(false);
            setSelectedUser(null);
            setIsCreatingUser(false);
          }
        }}
        onSave={handleSaveUser}
        isCreating={isCreatingUser}
        isSaving={savingUser}
      />

      <ProjectModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={() => {
          if (!savingProject) {
            setIsProjectModalOpen(false);
            setSelectedProject(null);
            setIsCreatingProject(false);
          }
        }}
        onSave={handleSaveProject}
        holidays={holidays}
        isCreating={isCreatingProject}
        isSaving={savingProject}
      />
    </div>
  );
}