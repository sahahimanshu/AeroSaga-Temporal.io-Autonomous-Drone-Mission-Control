import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="app-shell">
      <main className="main-content full-width">
        <Outlet />
      </main>
    </div>
  );
}