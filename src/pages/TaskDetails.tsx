import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Clock, MessageSquare, Plus, User, Calendar, AlertTriangle } from "lucide-react";
import { Task, User as UserType } from "@/types/task";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  content: string;
  author: UserType;
  createdAt: Date;
}

interface TimeLog {
  id: string;
  description: string;
  hours: number;
  author: UserType;
  createdAt: Date;
}

// Mock data - in real app this would come from API
const mockComments: Comment[] = [
  {
    id: '1',
    content: 'Initial task setup completed. Started working on authentication flow.',
    author: { id: '2', name: 'Mike Chen', role: 'developer', email: 'mike@company.com' },
    createdAt: new Date('2024-01-12T10:30:00')
  }
];

const mockTimeLogs: TimeLog[] = [
  {
    id: '1',
    description: 'Set up authentication backend',
    hours: 4,
    author: { id: '2', name: 'Mike Chen', role: 'developer', email: 'mike@company.com' },
    createdAt: new Date('2024-01-12T14:00:00')
  }
];

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock task data - in real app this would be fetched by ID
  const [task] = useState<Task>({
    id: 'TASK-001',
    name: 'Implement user authentication',
    description: 'Add login and registration functionality with JWT tokens and secure password hashing.',
    status: 'in-progress',
    priority: 'high',
    reporter: { id: '1', name: 'Sarah Johnson', role: 'manager', email: 'sarah@company.com' },
    assignee: { id: '2', name: 'Mike Chen', role: 'developer', email: 'mike@company.com' },
    project: {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Main e-commerce platform development',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      estimatedHours: 960,
      createdAt: new Date('2024-01-01')
    },
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-15'),
    hours: 32,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12')
  });

  const [comments, setComments] = useState<Comment[]>(mockComments);
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>(mockTimeLogs);
  const [newComment, setNewComment] = useState('');
  const [newTimeLog, setNewTimeLog] = useState({ description: '', hours: '' });
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [isAddingTimeLog, setIsAddingTimeLog] = useState(false);
  
  const currentUser = { id: '2', name: 'Mike Chen', role: 'developer', email: 'mike@company.com' } as UserType;

  const statusConfig = {
    'todo': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'To Do' },
    'in-progress': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'In Progress' },
    'review': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'In Review' },
    'done': { bg: 'bg-green-100', text: 'text-green-800', label: 'Done' }
  };

  const priorityConfig = {
    'low': { bg: 'bg-green-100', text: 'text-green-800', label: 'Low' },
    'medium': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Medium' },
    'high': { bg: 'bg-orange-100', text: 'text-orange-800', label: 'High' },
    'urgent': { bg: 'bg-red-100', text: 'text-red-800', label: 'Urgent' }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setIsAddingComment(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const comment: Comment = {
        id: `comment-${Date.now()}`,
        content: newComment,
        author: currentUser,
        createdAt: new Date()
      };
      
      setComments(prev => [...prev, comment]);
      setNewComment('');
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
      });
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleAddTimeLog = async () => {
    if (!newTimeLog.description.trim() || !newTimeLog.hours) return;
    
    setIsAddingTimeLog(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const timeLog: TimeLog = {
        id: `timelog-${Date.now()}`,
        description: newTimeLog.description,
        hours: parseFloat(newTimeLog.hours),
        author: currentUser,
        createdAt: new Date()
      };
      
      setTimeLogs(prev => [...prev, timeLog]);
      setNewTimeLog({ description: '', hours: '' });
      toast({
        title: "Time logged",
        description: `${timeLog.hours} hours logged successfully.`,
      });
    } finally {
      setIsAddingTimeLog(false);
    }
  };

  const totalLoggedHours = timeLogs.reduce((sum, log) => sum + log.hours, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-xl font-bold">{task.name}</h1>
              <p className="text-sm text-muted-foreground">{task.id}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Details */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{task.name}</CardTitle>
                    <p className="text-muted-foreground mt-2">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${statusConfig[task.status].bg} ${statusConfig[task.status].text}`}>
                      {statusConfig[task.status].label}
                    </Badge>
                    <Badge className={`${priorityConfig[task.priority].bg} ${priorityConfig[task.priority].text}`}>
                      {priorityConfig[task.priority].label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Project</div>
                    <div className="font-medium">{task.project.name}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Start Date</div>
                    <div className="font-medium">{task.startDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Due Date</div>
                    <div className="font-medium">{task.endDate.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Estimated Hours</div>
                    <div className="font-medium">{task.hours}h</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm text-muted-foreground">Reporter</div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.reporter.name}`} />
                          <AvatarFallback className="text-xs">
                            {task.reporter.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{task.reporter.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {task.reporter.role}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  {task.assignee && (
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm text-muted-foreground">Assignee</div>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.assignee.name}`} />
                            <AvatarFallback className="text-xs">
                              {task.assignee.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{task.assignee.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {task.assignee.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Comments Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Comments ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.author.name}`} />
                        <AvatarFallback className="text-xs">
                          {comment.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{comment.author.name}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{comment.createdAt.toLocaleString()}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
                
                <div className="space-y-3">
                  <Label htmlFor="comment">Add a comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Write your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    disabled={isAddingComment}
                  />
                  <Button 
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isAddingComment}
                    className="gap-2"
                  >
                    {isAddingComment ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Add Comment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Time Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Time Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold">{totalLoggedHours}h</div>
                  <div className="text-sm text-muted-foreground">
                    of {task.hours}h estimated
                  </div>
                  <div className="w-full bg-background rounded-full h-2 mt-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Math.min((totalLoggedHours / task.hours) * 100, 100)}%` }}
                    />
                  </div>
                </div>
                
                {timeLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${log.author.name}`} />
                          <AvatarFallback className="text-xs">
                            {log.author.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{log.author.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {log.hours}h
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.description}</p>
                    <p className="text-xs text-muted-foreground">{log.createdAt.toLocaleString()}</p>
                  </div>
                ))}
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Log Time</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="col-span-2">
                      <Input
                        placeholder="Description"
                        value={newTimeLog.description}
                        onChange={(e) => setNewTimeLog(prev => ({ ...prev, description: e.target.value }))}
                        disabled={isAddingTimeLog}
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Hours"
                        value={newTimeLog.hours}
                        onChange={(e) => setNewTimeLog(prev => ({ ...prev, hours: e.target.value }))}
                        disabled={isAddingTimeLog}
                        min="0.1"
                        step="0.1"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={handleAddTimeLog}
                    disabled={!newTimeLog.description.trim() || !newTimeLog.hours || isAddingTimeLog}
                    className="w-full gap-2"
                    size="sm"
                  >
                    {isAddingTimeLog ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    Log Time
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Task Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Task Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <div className="text-muted-foreground">Created</div>
                  <div>{task.createdAt.toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Last Updated</div>
                  <div>{task.updatedAt.toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Project Duration</div>
                  <div>{task.project.startDate.toLocaleDateString()} - {task.project.endDate.toLocaleDateString()}</div>
                </div>
                {task.endDate < new Date() && task.status !== 'done' && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">Overdue</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}