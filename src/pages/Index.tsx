import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import { UserModal, UserFormData } from "@/components/UserModal";
import { ProjectModal, ProjectFormData } from "@/components/ProjectModal";
import { UserSelector } from "@/components/UserSelector";
import { Reports } from "@/components/Reports";
import { TaskCard } from "@/components/TaskCard";
import { Task, TaskFormData, User, Project } from "@/types/task";
import { Plus, BarChart3, Calendar, Users, TrendingUp, AlertTriangle, UserPlus, Edit, Trash2, FolderPlus, LogOut } from "lucide-react";
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
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Mobile App',
    description: 'Mobile application for customers',
    createdAt: new Date('2024-01-05')
  },
  {
    id: '3',
    name: 'Analytics Dashboard',
    description: 'Internal analytics and reporting dashboard',
    createdAt: new Date('2024-01-10')
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
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const { toast } = useToast();

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

  const handleSaveTask = (taskData: TaskFormData) => {
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
    setIsTaskModalOpen(false);
    setSelectedTask(null);
    setIsCreatingTask(false);
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

  const handleDeleteUser = (user: User) => {
    if (user.id === currentUser.id) {
      toast({
        title: "Cannot delete current user",
        description: "You cannot delete the user you are currently logged in as.",
        variant: "destructive",
      });
      return;
    }
    
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
  };

  const handleSaveUser = (userData: UserFormData) => {
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
    setIsUserModalOpen(false);
    setSelectedUser(null);
    setIsCreatingUser(false);
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

  const handleDeleteProject = (project: Project) => {
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
    
    setProjects(prev => prev.filter(p => p.id !== project.id));
    toast({
      title: "Project deleted successfully",
      description: `"${project.name}" has been removed.`,
    });
  };

  const handleSaveProject = (projectData: ProjectFormData) => {
    if (isCreatingProject) {
      // Creating a new project
      const newProject: Project = {
        id: `project-${Date.now()}`,
        name: projectData.name,
        description: projectData.description,
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
        description: projectData.description
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
    setIsProjectModalOpen(false);
    setSelectedProject(null);
    setIsCreatingProject(false);
  };

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
              <UserSelector
                users={users}
                selectedUserId={currentUser.id}
                onSelect={(userId) => {
                  const user = users.find(u => u.id === userId);
                  if (user) setCurrentUser(user);
                }}
              />
              {currentUser.role === 'manager' && (
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="kanban" className="space-y-4">
            <KanbanBoard 
              tasks={tasks}
              currentUser={currentUser}
              onEditTask={handleEditTask}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="space-y-4">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  canEdit={true}
                />
              ))}
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
            
            <div className="grid gap-4">
              {users.map(user => (
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
                        {user.id === currentUser.id && (
                          <Badge variant="secondary">Current</Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user)}
                          disabled={user.id === currentUser.id}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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
            
            <div className="grid gap-4">
              {projects.map(project => (
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
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProject(project)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <TaskModal
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTask(null);
          setIsCreatingTask(false);
        }}
        onSave={handleSaveTask}
        currentUser={currentUser}
        availableUsers={users}
        availableProjects={projects}
        isCreating={isCreatingTask}
      />

      <UserModal
        user={selectedUser}
        isOpen={isUserModalOpen}
        onClose={() => {
          setIsUserModalOpen(false);
          setSelectedUser(null);
          setIsCreatingUser(false);
        }}
        onSave={handleSaveUser}
        isCreating={isCreatingUser}
      />

      <ProjectModal
        project={selectedProject}
        isOpen={isProjectModalOpen}
        onClose={() => {
          setIsProjectModalOpen(false);
          setSelectedProject(null);
          setIsCreatingProject(false);
        }}
        onSave={handleSaveProject}
        isCreating={isCreatingProject}
      />
    </div>
  );
}