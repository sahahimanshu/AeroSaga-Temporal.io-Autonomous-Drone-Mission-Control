import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}