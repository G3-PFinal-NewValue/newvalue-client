import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";

// Páginas públicas
import HomePage from "../pages/public/HomePage/HomePage.jsx";
import LoginPage from "../pages/public/LoginPage/LoginPage";
import RegisterPage from "../pages/public/RegisterPage/RegisterPage";
import RegisterProfessionalPage from "../pages/public/RegisterProfessionalPage/RegisterProfessionalPage";
import BlogListPage from "../pages/public/Blog/BlogListPage.jsx";
import BlogArticlePage from "../pages/public/Blog/BlogArticlePage.jsx";
import PsychologistPublicProfile from "../pages/public/PsychologistPublicProfile/PsychologistPublicProfile";
import PsychologistListPage from "../pages/public/PsychologistListPage/PsychologistListPage";
import ContactPage from "../pages/public/ContactPage/ContactPage";
import TreatmentsPage from "../pages/public/Treatments/TreatmentsPage.jsx";
import FirstSessionForm from "../pages/public/FirstSessionForm/FirstSessionForm.jsx";
import SetPassword from "../pages/public/AdminCreateUser/SetPassword.jsx";
// Protegidas
import ProtectedRoute from "./ProtectedRoute";
import PsychologistProfileSetup from "../pages/private/PsychologistProfile/PsychologistProfileSetup";
import PatientProfileSetup from "../pages/private/PatientProfile/PatientProfileSetup";
import MyPatientProfile from "../pages/private/PatientProfile/MyPatientProfile";
import PatientProfileView from "../pages/private/PatientProfile/PatientProfileView";
import AdminDashboard from "../pages/private/AdminDashboard/AdminDashboard";
import PatientAppointmentsPage from "../pages/private/PatientAppointmentsPage/PatientAppointmentsPage";
import PsychologistDashboardPage from "../pages/private/PsychologistDashboardPage/PsychologistDashboardPage";
import ChooseRolePage from "../pages/public/ChooseRolePage/ChooseRolePage.jsx";
import CreateArticlePage from "../pages/private/BlogPages/CreateArticlePage.jsx";
import EditArticlePage from "../pages/private/BlogPages/EditArticlePage.jsx";
import CreateUserForm from "../pages/private/AdminDashboard/CreateUserForm.jsx";

import { useAuth } from "../context/AuthContext";

// Demo privada (temporal)
function PrivateHome() {
  const { user } = useAuth();
  return (
    <section className="grid gap-4">
      <h1 className="text-2xl font-bold">Área privada</h1>
      <p className="text-gray-700">
        Hola, {user?.name}. Esta vista requiere estar autenticado.
      </p>
    </section>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas con Layout (Navbar visible) */}
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/register-professional"
            element={<RegisterProfessionalPage />}
          />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:id" element={<BlogArticlePage />} />
          <Route path="/profile/:id" element={<PsychologistPublicProfile />} />
          <Route path="/psychologists" element={<PsychologistListPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/treatments" element={<TreatmentsPage />} />
          <Route path="/first-session" element={<FirstSessionForm />} />
          <Route path="/set-password/:token" element={<SetPassword />} />
        </Route>

        {/* Rutas privadas con Layout (Navbar visible) */}
        <Route element={<Layout />}>
          <Route
            path="/elegir-rol"
            element={
              <ProtectedRoute>
                <ChooseRolePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <PrivateHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/profile"
            element={
              <ProtectedRoute>
                <PsychologistProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/dashboard"
            element={
              <ProtectedRoute allowedRoles={["psychologist"]}>
                <PsychologistDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/profile-setup/patient"
            element={
              <ProtectedRoute>
                {" "}
                <PatientProfileSetup />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/my-profile"
            element={
              <ProtectedRoute>
                {" "}
                <MyPatientProfile />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/patients/:id"
            element={
              <ProtectedRoute allowedRoles={["psychologist", "admin"]}>
                <PatientProfileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/my-appointments"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientAppointmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                {" "}
                <AdminDashboard />{" "}
              </ProtectedRoute>
            }
          />
          <Route 
          path="/admin/create-user" 
          element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <CreateUserForm />
            </ProtectedRoute>
            } 
            />
      </Route>
        <Route path="/blog/:id" element={<BlogArticlePage />} />
        <Route path="/admin/article/create" element={<CreateArticlePage />} />
        <Route path="/admin/article/edit/:id" element={<EditArticlePage />} />

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
