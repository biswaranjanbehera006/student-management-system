import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AddStudent from "./pages/students/AddStudent";
import EditStudent from "./pages/students/EditStudent";
import Settings from "./pages/Settings";

import Dashboard from "./pages/Dashboard";
import StudentList from "./pages/students/StudentList";

import ProtectedRoute from "./routes/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import Courses from "./pages/Courses";
import Reports from "./pages/Reports";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{ duration: 3500 }}
        />

        <Routes>
          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected Pages */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <DashboardLayout />
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<StudentList />} />
              <Route path="/students/add" element={<AddStudent />} />
              <Route
  path="/courses"
  element={<Courses />}
/>
                <Route
  path="/reports"
  element={<Reports />}
/>
              <Route
  path="/settings"
  element={<Settings />}
/>
              <Route
  path="/students/edit/:id"
  element={<EditStudent />}
/>
            </Route>
          </Route>

          {/* Default */}
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;