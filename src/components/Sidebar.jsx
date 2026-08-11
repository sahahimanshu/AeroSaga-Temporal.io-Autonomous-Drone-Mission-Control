import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", path: "/" },
  /*{ label: "My Missions", path: "/my-missions" },
  { label: "My Drones", path: "/my-drones" },
  { label: "Live Map", path: "/live-map" },
  { label: "Alerts", path: "/alerts" },
  { label: "Settings", path: "/settings" },*/
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">AeroSaga</div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => (isActive ? "nav-item active" : "nav-item")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}