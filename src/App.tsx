import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Holidays from "./pages/Holidays";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import TaskDetails from "./pages/TaskDetails";
import PrivateRoute from "./components/PrivateRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1">
              <header className="h-12 flex items-center border-b bg-background px-4">
                <SidebarTrigger />
                <h1 className="ml-4 font-semibold">Task Management System</h1>
              </header>
              <div className="p-6">
                <Routes>
                  <Route path="/" element={<PrivateRoute><Index /></PrivateRoute>} />
                  <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                  <Route path="/holidays" element={<PrivateRoute><Holidays /></PrivateRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/task/:taskId" element={<TaskDetails />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
