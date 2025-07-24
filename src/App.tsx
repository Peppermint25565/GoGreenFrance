import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ClientDashboard from "./pages/client/ClientDashboard";
import CreateRequest from "./pages/client/CreateRequest";
import MyRequests from "./pages/client/MyRequests";
import ClientStats from "./pages/client/ClientStats";
import OrderHistory from "./pages/client/OrderHistory";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import ProviderProfile from "./pages/provider/ProviderProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Chat from "./pages/Chat";
import TermsOfService from "./pages/TermsOfService";
import ClientProfile from "./pages/client/ClientProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/client/dashboard" element={<ClientDashboard />} />
            <Route path="/client/profile" element={<ClientProfile />} />
            <Route path="/client/create-request" element={<CreateRequest />} />
            <Route path="/client/my-requests" element={<MyRequests />} />
            <Route path="/client/stats" element={<ClientStats />} />
            <Route path="/client/order-history" element={<OrderHistory />} />
            <Route path="/provider/dashboard" element={<ProviderDashboard />} />
            <Route path="/provider/profile" element={<ProviderProfile />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/chat/:requestId" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
