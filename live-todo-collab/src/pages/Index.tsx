import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/KanbanBoard";
import { AuthModal } from "@/components/AuthModal";
import { ActivityPanel } from "@/components/ActivityPanel";
import { Header } from "@/components/Header";
import { Users, Zap, Shield, Activity } from "lucide-react";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const features = [
    {
      icon: Users,
      title: "Real-Time Collaboration",
      description: "Work together with your team in real-time. See changes as they happen."
    },
    {
      icon: Zap,
      title: "Smart Assignment",
      description: "Automatically assign tasks to team members with the fewest active tasks."
    },
    {
      icon: Shield,
      title: "Conflict Resolution",
      description: "Handle simultaneous edits gracefully with our conflict resolution system."
    },
    {
      icon: Activity,
      title: "Activity Tracking",
      description: "Keep track of all changes with comprehensive activity logging."
    }
  ];

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <Header user={user} onLogout={() => setUser(null)} />
        <div className="flex">
          <main className="flex-1 p-6">
            <KanbanBoard user={user} />
          </main>
          <ActivityPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background"></div>
        <div className="relative">
          <Header user={user} onLogout={() => setUser(null)} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
                <span className="gradient-text">Collaborative</span>
                <br />
                Todo Board
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
                Build amazing projects together with real-time collaboration, 
                smart task assignment, and conflict-free editing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <Button 
                  variant="gradient" 
                  size="xl"
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bounce-in"
                >
                  Get Started Free
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="slide-in"
                >
                  View Demo
                </Button>
              </div>
            </div>
            
            {/* Demo Board Preview */}
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-3xl"></div>
              <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-2xl">
                <DemoKanbanBoard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Everything you need for team collaboration
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make your team more productive and organized.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="kanban-card group cursor-default"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuth={(userData) => {
          setUser(userData);
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
};

// Demo Kanban Board Component
const DemoKanbanBoard = () => {
  const demoTasks = {
    todo: [
      { id: 1, title: "Design user interface", assignee: "Sarah", priority: "high" },
      { id: 2, title: "Set up database", assignee: "Mike", priority: "medium" },
    ],
    inProgress: [
      { id: 3, title: "Implement authentication", assignee: "John", priority: "high" },
    ],
    done: [
      { id: 4, title: "Create project structure", assignee: "Sarah", priority: "low" },
      { id: 5, title: "Write API documentation", assignee: "Mike", priority: "medium" },
    ]
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {["todo", "inProgress", "done"].map((column) => (
        <div key={column} className="kanban-column">
          <h3 className="font-semibold text-lg mb-4 capitalize flex items-center gap-2">
            {column === "todo" && "📋"} 
            {column === "inProgress" && "⚡"} 
            {column === "done" && "✅"}
            {column.replace(/([A-Z])/g, ' $1').trim()}
          </h3>
          <div className="space-y-3">
            {demoTasks[column].map((task) => (
              <div key={task.id} className="kanban-card bg-background">
                <h4 className="font-medium mb-2">{task.title}</h4>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{task.assignee}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    task.priority === "high" ? "bg-destructive/10 text-destructive" :
                    task.priority === "medium" ? "bg-warning/10 text-warning" :
                    "bg-success/10 text-success"
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Index;
