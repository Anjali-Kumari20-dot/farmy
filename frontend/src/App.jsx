import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/useAuth";
import Loading from "./components/common/Loading";

// Pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import CropDemandPage from "./pages/CropDemandPage";
import SchedulePage from "./pages/SchedulePage";
import FormPage from "./pages/FormPage";

// Redirects authenticated users away from auth pages
function AuthRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

// Blocks unauthenticated users, shows spinner during session check
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}

function App() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<AuthRoute><RegisterPage /></AuthRoute>} />

      {/* Auth pages */}
      <Route path="/register" element={<AuthRoute><RegisterPage /></AuthRoute>} />
      <Route path="/login"    element={<AuthRoute><LoginPage /></AuthRoute>} />

      {/* Protected pages */}
      <Route path="/dashboard" element={<ProtectedRoute><LandingPage /></ProtectedRoute>} />
      <Route path="/slots"     element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/form"      element={<ProtectedRoute><FormPage /></ProtectedRoute>} />

      {/* Public info pages (no auth required) */}
      <Route path="/demand"   element={<CropDemandPage />} />
      <Route path="/schedule" element={<SchedulePage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
