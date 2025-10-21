import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../../components/common/Navbar/Navbar";


export default function Layout() {
const location = useLocation();
const hideNavbar =
  location.pathname === "/login" || location.pathname === "/register";
return (
  <div className="min-h-screen bg-gray-50">
    {!hideNavbar && <Navbar />}
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      <Outlet />
    </main>
  </div>
);
}
