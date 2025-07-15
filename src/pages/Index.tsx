import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KanbanBoard } from "@/components/KanbanBoard";
import { TaskModal } from "@/components/TaskModal";
import { UserSelector } from "@/components/UserSelector";
import { Reports } from "@/components/Reports";
import { Task, TaskFormData, User } from "@/types/task";
import { Plus, LayoutGrid, List, Users, BarChart3 } from "lucide-react";
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

const mockTasks: Task[] = [
  {
    id: 'TASK-001',
    name: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens and secure password hashing.',
    status: 'in-progress',
    priority: 'high',
    reporter: mockUsers[0],
    assignee: mockUsers[1],
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
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13')
  }
];

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [currentUser, setCurrentUser] = useState<User>(mockUsers[0]); // Default to manager
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreatingTask, setIsCreatingTask] = useState(false);
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
      const newTask: Task = {
        id: `TASK-${String(tasks.length + 1).padStart(3, '0')}`,
        name: taskData.name,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        reporter: currentUser,
        assignee: taskData.assigneeId ? mockUsers.find(u => u.id === taskData.assigneeId) || null : null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setTasks(prev => [...prev, newTask]);
      toast({
        title: "Task Created",
        description: `"${newTask.name}" has been created successfully.`
      });
    } else if (selectedTask) {
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id 
          ? {
              ...task,
              name: taskData.name,
              description: taskData.description,
              status: taskData.status,
              priority: taskData.priority,
              assignee: taskData.assigneeId ? mockUsers.find(u => u.id === taskData.assigneeId) || null : null,
              updatedAt: new Date()
            }
          : task
      ));
      toast({
        title: "Task Updated",
        description: `"${selectedTask.name}" has been updated successfully.`
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold text-foreground">TaskBoard</h1>
              </div>
              <Badge variant="outline" className="text-xs">
                Developer Team
              </Badge>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-60">
                <UserSelector
                  users={mockUsers}
                  selectedUserId={currentUser.id}
                  onSelect={(userId) => {
                    const user = mockUsers.find(u => u.id === userId);
                    if (user) setCurrentUser(user);
                  }}
                />
              </div>
              
              {currentUser.role === 'manager' && (
                <Button onClick={handleCreateTask} className="gap-2">
                  <Plus className="h-4 w-4" />
                  New Task
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="kanban" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-full max-w-[500px] grid-cols-4">
              <TabsTrigger value="kanban" className="gap-2">
                <LayoutGrid className="h-4 w-4" />
                Kanban
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
              <TabsTrigger value="stats" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Reports
              </TabsTrigger>
            </TabsList>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{taskStats.total} tasks • {taskStats.assigned} assigned</span>
            </div>
          </div>

          <TabsContent value="kanban" className="space-y-6">
            <KanbanBoard
              tasks={tasks}
              onEditTask={handleEditTask}
              currentUser={currentUser}
            />
          </TabsContent>

          <TabsContent value="list" className="space-y-4">
            <div className="grid gap-4">
              {tasks.map(task => (
                <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleEditTask(task)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{task.name}</h3>
                          <Badge variant="outline" className="text-xs">{task.id}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{task.status}</Badge>
                          <Badge variant="outline">{task.priority}</Badge>
                          {task.assignee && (
                            <span className="text-sm">→ {task.assignee.name}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.total}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Assigned</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.assigned}</div>
                  <p className="text-xs text-muted-foreground">
                    {taskStats.unassigned} unassigned
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{taskStats.byStatus['in-progress'] || 0}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
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

          <TabsContent value="reports" className="space-y-6">
            <Reports tasks={tasks} users={mockUsers} />
          </TabsContent>
        </Tabs>
      </main>

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSave={handleSaveTask}
        currentUser={currentUser}
        availableUsers={mockUsers}
        isCreating={isCreatingTask}
      />
    </div>
  );
};

export default Index;
