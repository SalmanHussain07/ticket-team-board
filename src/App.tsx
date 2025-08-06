import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import TaskDetails from "./pages/TaskDetails";
import PrivateRoute from "./components/PrivateRoute";

// localStorage.removeItem("token"); // Remove this line when deploying
// localStorage.removeItem("user"); // Remove this line when deploying
// localStorage.removeItem("isloggedin"); // Remove this line when deploying

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <PrivateRoute> <Index /> </PrivateRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/task/:taskId" element={<TaskDetails />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
