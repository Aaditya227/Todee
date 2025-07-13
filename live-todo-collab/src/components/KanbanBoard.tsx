import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User, Calendar, Flag, Zap, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "inProgress" | "done";
  assignee: string;
  priority: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

interface KanbanBoardProps {
  user: any;
}

export const KanbanBoard = ({ user }: KanbanBoardProps) => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design user interface",
      description: "Create wireframes and mockups for the main dashboard",
      status: "todo",
      assignee: "Sarah Chen",
      priority: "high",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "2",
      title: "Set up database",
      description: "Configure PostgreSQL and create initial schema",
      status: "todo",
      assignee: "Mike Johnson",
      priority: "medium",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "3",
      title: "Implement authentication",
      description: "Add JWT-based authentication with Supabase",
      status: "inProgress",
      assignee: "John Doe",
      priority: "high",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "4",
      title: "Create project structure",
      description: "Set up the initial React project with TypeScript",
      status: "done",
      assignee: "Sarah Chen",
      priority: "low",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const columns = [
    { id: "todo", title: "To Do", emoji: "📋", color: "bg-blue-100 text-blue-800" },
    { id: "inProgress", title: "In Progress", emoji: "⚡", color: "bg-yellow-100 text-yellow-800" },
    { id: "done", title: "Done", emoji: "✅", color: "bg-green-100 text-green-800" }
  ];

  const teamMembers = [
    "Sarah Chen",
    "Mike Johnson", 
    "John Doe",
    "Emily Rodriguez",
    "David Kim"
  ];

  const getTasksByStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedTask) {
      setTasks(prev => prev.map(task => 
        task.id === draggedTask.id 
          ? { ...task, status: newStatus as Task["status"], updatedAt: new Date() }
          : task
      ));
      setDraggedTask(null);
    }
  };

  const handleCreateTask = (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setTasks(prev => [...prev, newTask]);
    setIsCreateTaskOpen(false);
  };

  const handleSmartAssign = (taskId: string) => {
    // Count active tasks per team member
    const taskCounts = teamMembers.reduce((acc, member) => {
      acc[member] = tasks.filter(task => 
        task.assignee === member && task.status !== "done"
      ).length;
      return acc;
    }, {} as Record<string, number>);

    // Find member with fewest active tasks
    const memberWithFewestTasks = Object.entries(taskCounts)
      .sort(([,a], [,b]) => a - b)[0][0];

    setTasks(prev => prev.map(task =>
      task.id === taskId
        ? { ...task, assignee: memberWithFewestTasks, updatedAt: new Date() }
        : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  return (
    <div className="space-y-6">
      {/* Board Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Project Board</h1>
          <p className="text-muted-foreground">Manage your team's tasks and track progress</p>
        </div>
        
        <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
          <DialogTrigger asChild>
            <Button variant="gradient" className="gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
            </DialogHeader>
            <TaskForm 
              onSubmit={handleCreateTask}
              teamMembers={teamMembers}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <div
            key={column.id}
            className="kanban-column"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <span className="text-2xl">{column.emoji}</span>
                {column.title}
                <Badge variant="secondary" className="ml-2">
                  {getTasksByStatus(column.id).length}
                </Badge>
              </h3>
            </div>
            
            <div className="space-y-3 min-h-[300px]">
              {getTasksByStatus(column.id).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDragStart={handleDragStart}
                  onSmartAssign={handleSmartAssign}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Task Dialog */}
      {editingTask && (
        <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Task</DialogTitle>
            </DialogHeader>
            <TaskForm
              task={editingTask}
              teamMembers={teamMembers}
              onSubmit={(taskData) => {
                setTasks(prev => prev.map(task =>
                  task.id === editingTask.id
                    ? { ...taskData, id: editingTask.id, createdAt: editingTask.createdAt, updatedAt: new Date() }
                    : task
                ));
                setEditingTask(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Task Card Component
interface TaskCardProps {
  task: Task;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onSmartAssign: (taskId: string) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard = ({ task, onDragStart, onSmartAssign, onEdit, onDelete }: TaskCardProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-warning/10 text-warning border-warning/20";
      case "low": return "bg-success/10 text-success border-success/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card
      className="kanban-card cursor-grab active:cursor-grabbing group"
      draggable
      onDragStart={(e) => onDragStart(e, task)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium line-clamp-2">
            {task.title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSmartAssign(task.id)}>
                <Zap className="h-4 w-4 mr-2" />
                Smart Assign
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {task.description && (
          <CardDescription className="text-xs line-clamp-2">
            {task.description}
          </CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-muted-foreground">
            <User className="h-3 w-3" />
            <span className="truncate max-w-[80px]">{task.assignee}</span>
          </div>
          
          <Badge 
            variant="outline" 
            className={`text-xs ${getPriorityColor(task.priority)}`}
          >
            <Flag className="h-2 w-2 mr-1" />
            {task.priority}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

// Task Form Component
interface TaskFormProps {
  task?: Task;
  teamMembers: string[];
  onSubmit: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
}

const TaskForm = ({ task, teamMembers, onSubmit }: TaskFormProps) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "todo" as Task["status"],
    assignee: task?.assignee || "",
    priority: task?.priority || "medium" as Task["priority"]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title..."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter task description..."
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignee">Assignee</Label>
          <Select value={formData.assignee} onValueChange={(value) => setFormData({ ...formData, assignee: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Select assignee" />
            </SelectTrigger>
            <SelectContent>
              {teamMembers.map((member) => (
                <SelectItem key={member} value={member}>
                  {member}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as Task["priority"] })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value as Task["status"] })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="inProgress">In Progress</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit" variant="gradient">
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </form>
  );
};