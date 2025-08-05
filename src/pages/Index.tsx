import { useState, useMemo, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import { UserModal, UserFormData } from "@/components/UserModal";
import { ProjectModal, ProjectFormData } from "@/components/ProjectModal";
import { UserSelector } from "@/components/UserSelector";
import { Reports } from "@/components/Reports";
import { TaskCard } from "@/components/TaskCard";
import { Task, TaskFormData, User, Project, TaskStatus, TaskPriority, UserRole } from "@/types/task";
import { Plus, BarChart3, Calendar, Users, TrendingUp, AlertTriangle, UserPlus, Edit, Trash2, FolderPlus, LogOut, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HttpClient } from "@/api/communicator";



//previous mock task
  // {
  //   id: 'TASK-002',
  //   name: 'Design responsive dashboard',
  //   description: 'Create a mobile-friendly dashboard with charts and data visualization components.',
  //   status: 'todo',
  //   priority: 'medium',
  //   reporter: mockUsers[0],
  //   assignee: mockUsers[2],
  //   project: mockProjects[2],
  //   createdAt: new Date('2024-01-11'),
  //   updatedAt: new Date('2024-01-11')
  // },

// Mock data for demonstration
// const mockUsers: User[] = [
//   {
//     id: '1',
//     name: 'Sarah Johnson',
//     full_name: 'Sarah Johnson',
//     role: 'manager',
//     email: 'sarah@company.com',
//     created_at: '2024-01-01'
//   },
//   {
//     id: '2',
//     name: 'Mike Chen',
//     full_name: 'Mike Chen',
//     role: 'developer',
//     email: 'mike@company.com',
//     created_at: '2024-01-01'
//   },
//   {
//     id: '3',
//     name: 'Emily Davis',
//     full_name: 'Emily Davis',
//     role: 'developer',
//     email: 'emily@company.com',
//     created_at: '2024-01-01'
//   },
//   {
//     id: '4',
//     name: 'Alex Kim',
//     full_name: 'Alex Kim',
//     role: 'developer',
//     email: 'alex@company.com',
//     created_at: '2024-01-01'
//   },
//   {
//     id: '11111111-1111-1111-1111-111111111111',
//     name: 'user1',
//     full_name: 'user 1',
//     role: 'developer',
//     email: 'user1@company.com',
//     created_at: '2024-01-01'
//   }
// ];

// const mockProjects: Project[] = [
//   {
//     id: '1',
//     name: 'E-commerce Platform',
//     description: 'Main e-commerce platform development',
//     createdAt: new Date('2024-01-01')
//   },
//   {
//     id: '2',
//     name: 'Mobile App',
//     description: 'Mobile application for customers',
//     createdAt: new Date('2024-01-05')
//   },
//   {
//     id: '3',
//     name: 'Analytics Dashboard',
//     description: 'Internal analytics and reporting dashboard',
//     createdAt: new Date('2024-01-10')
//   }
// ];

// const mockTasks: Task[] = [
//   {
//     id: 'TASK-001',
//     name: 'Implement user authentication',
//     description: 'Add login and registration functionality with JWT tokens and secure password hashing.',
//     status: 'in-progress',
//     priority: 'high',
//     assignor: "user1",
//     assignee: "user2",
//     project: "project1",
//     created_at: '2024-01-11',
//     updated_at: '2024-01-11'
//   },
//   {
//     id: 'TASK-002',
//     name: 'Design responsive dashboard',
//     description: 'Create a mobile-friendly dashboard with charts and data visualization components.',
//     status: 'todo',
//     priority: 'medium',
//     assignor: "user1",
//     assignee: "user2",
//     project: "project1",
//     created_at: '2024-01-11',
//     updated_at: '2024-01-11'
//   },
//   {
//     id: 'TASK-003',
//     name: 'Fix production bug #247',
//     description: 'Resolve critical bug causing API timeouts in production environment.',
//     status: 'review',
//     priority: 'urgent',
//     assignor: "user2",
//     assignee: "user3",
//     project: "project1",
//     created_at: '2024-01-11',
//     updated_at: '2024-01-11'
//   },
//   {
//     id: 'TASK-004',
//     name: 'Update documentation',
//     description: 'Refresh API documentation and add examples for new endpoints.',
//     status: 'done',
//     priority: 'low',
//     assignor: "user2",
//     assignee: "user3",
//     project: "project1",
//     created_at: '2024-01-11',
//     updated_at: '2024-01-11'
//   },
//   {
//     id: 'TASK-005',
//     name: 'Performance optimization',
//     description: 'Optimize database queries and implement caching for better performance.',
//     status: 'todo',
//     priority: 'medium',
//     assignor: "user2",
//     assignee: "user3",
//     project: "project1",
//     created_at: '2024-01-11',
//     updated_at: '2024-01-11'
//   }
// ];

export default function Index() {
  // const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [roles, setRoles] = useState<UserRole[]>([]);
  // const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]);
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
  const { toast } = useToast();


useEffect(() => {
  
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');

      if (!token || !userString) {
        console.warn("User not logged in");
        return;
      }

      const user = JSON.parse(userString);
      setCurrentUser(user);


      // Fetch tasks by user ID
      const response = await HttpClient.GET<Task[]>(`/api/Tasks/user/${user.id}`);

      if (!response.isError && response.data) {
        setTasks(response.data);
      } else {
        console.error("Failed to fetch tasks:", response.message);
      }


      // Fetch all users
      const userResponse = await HttpClient.GET<User[]>('/api/User');

      if (!userResponse.isError && userResponse.data) {
        setUsers(userResponse.data);
      } else {
        console.error("Failed to fetch users:", userResponse.message);
      }

      // Fetch all projects
      const projectResponse = await HttpClient.GET<Project[]>('/api/Project');

      if (!projectResponse.isError && projectResponse.data) {
        setProjects(projectResponse.data);
      } else {
        console.error("Failed to fetch users:", projectResponse.message);
      }

      // Fetch all roles
      const roleResponse = await HttpClient.GET<UserRole[]>('/api/Role');

      if (!roleResponse.isError && roleResponse.data) {
        setRoles(roleResponse.data);
      } else {
        console.error("Failed to fetch users:", roleResponse.message);
      }


    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  fetchData();
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
  if (!['manager', 'admin'].includes(currentUser.role)) {
    toast({
      title: "Access Denied",
      description: "Only managers and admins can create new tasks.",
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

  const statusMap: Record<TaskStatus, number> = {
  'todo': 1,
  'in-progress': 2,
  'review': 3,
  'done': 4
};

const priorityMap: Record<TaskPriority, number> = {
  'low': 1,
  'medium': 2,
  'high': 3,
  'urgent': 4
};

// const roleMap: Record<UserRole, number> = {
//   'admin': 1,
//   'manager': 2,
//   'developer': 3
// };


  const handleSaveTask = async (taskData: TaskFormData) => {

    console.log("handleSaveTask");
    
    if (isCreatingTask) {
      // Creating a new task

      const newTask = {
        title: taskData.name,
        description: taskData.description,
        status_Id: statusMap[taskData.status],
        priority_Id: priorityMap[taskData.priority],
        project_Id: taskData.projectId,
        assignor_Id: currentUser.id, // the one creating the task
        due_Date: null,
        assignee_Id: taskData.assigneeId
      };

    
      const response = await HttpClient.POST<Task>('/api/Tasks', newTask);

      if (!response.isError && response.data) {
        const createdTask = response.data; // This is a complete Task

        setTasks(prev => [...prev, createdTask]); // No TS error here
      toast({
        title: "Task created successfully",
        description: `"${newTask.title}" has been created.`,
      })};
    } else if (selectedTask) {
        console.log("Editing existing task");


      const updatedTask = {
      id: selectedTask.id,
      title: taskData.name,
      description: taskData.description,
      status_Id: statusMap[taskData.status],
      priority_Id: priorityMap[taskData.priority],
      project_Id: taskData.projectId,
      assignee_Id: taskData.assigneeId
      };
      const response = await HttpClient.Put<Task>(`/api/Tasks/${selectedTask.id}`, updatedTask);

      if (!response.isError && response.data) {
      setTasks(prev =>
        prev.map(task => task.id === response.data!.id ? response.data! : task)
      );
      toast({
        title: "Task updated successfully",
        description: `"${updatedTask.title}" has been updated.`,
      });
      }
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

  const handleDeleteUser = async (user: User) => {
    console.log("handleDeleteUser");
    if (user.id === currentUser.id) {
      toast({
        title: "Cannot delete current user",
        description: "You cannot delete the user you are currently logged in as.",
        variant: "destructive",
      });
      return;
    }

    const response = await HttpClient.DELETE<Project>(`/api/User/${user.id}`);

    if (!response.isError && response.data) {
      const deletedUser = response.data;
      setUsers(prev => prev.filter(p => p.id !== deletedUser.id));

      toast({
        title: "User deleted successfully",
        description: `"${deletedUser.name}" has been deleted.`,
      });
    }
    
    // setUsers(prev => prev.filter(u => u.id !== user.id));
    // // Remove user from tasks as assignee
    // setTasks(prev => prev.map(task => 
    //   task.assignee?.id === user.id 
    //     ? { ...task, assignee: null, updatedAt: new Date() }
    //     : task
    // ));
    // toast({
    //   title: "User deleted successfully",
    //   description: `"${user.name}" has been removed.`,
    // });
  };

  const confirmDeleteUser = (user: User) => {
    handleDeleteUser(user);
  };

const handleSaveUser = async (userData: UserFormData) => {

  const userPayload = {
    user_Name: userData.name,
    full_Name: userData.full_name,
    email: userData.email,
    password: userData.password,
    role_Id: roles.find(r => r.name === userData.role)?.id ?? null,
  };

  if (isCreatingUser) {
    console.log("creatingUser");
  
    // Create user
    const response = await HttpClient.POST<User>('/api/User', userPayload);

    if (!response.isError && response.data) {
      const createdUser = response.data;
      setUsers(prev => [...prev, createdUser]);
      toast({
        title: "User created successfully",
        description: `"${createdUser.name || userPayload.user_Name}" has been created.`,
      });
    }
  } else if (selectedUser) {
    console.log("updatingUser");
    //  Update user
    const response = await HttpClient.Put<User>(`/api/User/${selectedUser.id}`, userPayload);

    if (!response.isError && response.data) {
      const updatedUser = response.data;
      setUsers(prev =>
        prev.map(user => user.id === updatedUser.id ? updatedUser : user)
      );
      toast({
        title: "User updated successfully",
        description: `"${updatedUser.name || userPayload.user_Name}" has been updated.`,
      });
    }
  }

  // Cleanup
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

  const handleDeleteProject = async (project: Project) => {

    console.log("handleDeleteProject");
    // Check if project has tasks
    const projectTasks = tasks.filter(task => task.projectId === project.id);
    if (projectTasks.length > 0) {
      toast({
        title: "Cannot delete project",
        description: `This project has ${projectTasks.length} task(s). Please reassign or delete them first.`,
        variant: "destructive",
      });
      return;
    }


    const response = await HttpClient.DELETE<Project>(`/api/Project/${project.id}`);

    if (!response.isError && response.data) {
      const deletedProject = response.data;
      setProjects(prev => prev.filter(p => p.id !== deletedProject.id));

      toast({
        title: "Project deleted successfully",
        description: `"${deletedProject.name || project.name}" has been deleted.`,
      });
    }



    
    // setProjects(prev => prev.filter(p => p.id !== project.id));
    // toast({
    //   title: "Project deleted successfully",
    //   description: `"${project.name}" has been removed.`,
    // });
  };

  const confirmDeleteProject = (project: Project) => {
    handleDeleteProject(project);
  };

  const handleSaveProject = async (projectData: ProjectFormData) => {
    console.log("handleSaveProject");

    const projectPayload = {
    project_Name: projectData.name,
    description: projectData.description
    };

    if (isCreatingProject) {

      console.log("creatingProject");

    // Create project
    const response = await HttpClient.POST<Project>('/api/Project', projectPayload);

    if (!response.isError && response.data) {
      const createdProject = response.data;
      setProjects(prev => [...prev, createdProject]);

      toast({
        title: "Project created successfully",
        description: `"${createdProject.name || projectPayload.project_Name}" has been created.`,
      });
    }
      
    } else if (selectedProject) {
      // Editing existing project

        console.log("updatingProject");

      // Update project
      const response = await HttpClient.Put<Project>(`/api/Project/${selectedProject.id}`, projectPayload);

      if (!response.isError && response.data) {
        const updatedProject = response.data;
        setProjects(prev =>
          prev.map(project => project.id === updatedProject.id ? updatedProject : project)
        );

        toast({
          title: "Project updated successfully",
          description: `"${updatedProject.name || projectPayload.project_Name}" has been updated.`,
        });
      }
      
    }
    setIsProjectModalOpen(false);
    setSelectedProject(null);
    setIsCreatingProject(false);
  };

   if (!currentUser || tasks.length === 0) {
        return <p>Loading...</p>; // Or return a spinner / skeleton
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
              {/* <UserSelector
                users={users}
                selectedUserId={currentUser.id}
                onSelect={(userId) => {
                  const user = users.find(u => u.id === userId);
                  if (user) setCurrentUser(user);
                }}
              /> */}

              {currentUser && (
                <div className="flex items-center gap-2 w-full px-3 py-2 border rounded-md">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${currentUser.name}`} />
                    <AvatarFallback className="text-xs bg-primary/10">
                      {currentUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{currentUser.name}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ml-auto ${
                      currentUser.role === 'manager' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {currentUser.role}
                  </Badge>
                </div>
              )}





              {/* {currentUser.role === 'manager' && (
                <Button onClick={handleCreateTask} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              )} */}

              {['manager', 'admin'].includes(currentUser.role) && (
                <Button onClick={handleCreateTask} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              )}

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem("user");
                  window.location.href = '/login';
                }}
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
          <TabsList className="flex w-full justify-evenly">
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            {/* <TabsTrigger value="users">Users</TabsTrigger> */}
            {/* <TabsTrigger value="projects">Projects</TabsTrigger> */}

            {['manager', 'admin'].includes(currentUser.role) && (
              <>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </>
            )}
          </TabsList>

          {/* <TabsContent value="kanban" className="space-y-4">              
            <KanbanBoard 
              tasks={tasks}
              currentUser={currentUser}
              onEditTask={handleEditTask}
            />
          </TabsContent> */}


          <TabsContent value="kanban" className="space-y-4">
            {tasks.length > 0 ? (
              <KanbanBoard 
                tasks={tasks}
                currentUser={currentUser}
                onEditTask={handleEditTask}
              />
            ) : (
              <p>No tasks found.</p>
            )}
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
              {filteredTasks.map((task) => (
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
              {filteredUsers.map(user => (
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={user.id === currentUser.id}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                               This action cannot be undone. This will permanently delete the user "{user.name}".{" "}
                                {tasks.some(t => t.assigneeId === user.id)
                                  ? "This user is assigned to tasks and cannot be removed."
                                    : ""}
                                </AlertDialogDescription>

                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                               onClick={() => confirmDeleteUser(user)}
                               disabled={tasks.some(t => t.assigneeId === user.id)}
                               >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
              {filteredProjects.map(project => (
                <Card key={project.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{project.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                              {/* <span>Created: {project.createdAt.toLocaleDateString()}</span> */}
                              <span>Created: {project.createdAt}</span>
                              {/* <span>Tasks: {tasks.filter(t => t.projectId === project.id).length}</span> */}
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
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the project "{project.name}". {tasks.filter(t => t.projectId === project.id).length > 0 ? 'This project has tasks assigned to it and cannot be deleted.' : ''}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => confirmDeleteProject(project)}
                                    disabled={tasks.filter(t => t.projectId === project.id).length > 0}
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
        roles={roles}
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