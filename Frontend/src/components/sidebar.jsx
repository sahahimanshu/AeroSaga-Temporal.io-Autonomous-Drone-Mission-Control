function Sidebar() {
  const menuItems = [
    { icon: "🏠", name: "Dashboard" },
    { icon: "📡", name: " My Drones" },
    { icon: "📋", name: "Missions" },
    { icon: "📍", name: "Waypoints" },
    { icon: "🗺️", name: "Live Map" },
    { icon: "🔔", name: "Alerts", badge: 5 },
    { icon: "📄", name: "Reports" },
    { icon: "🔧", name: "Maintenance" },
    { icon: "♟", name: "Users" },
    { icon: "⚙️", name: "Settings" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-menu-title">MENU</div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div
            key={item.name}
            className={`sidebar-item ${index === 0 ? "active" : ""}`}
          >
            <span className="sidebar-icon">{item.icon}</span>

            <span className="sidebar-name">{item.name}</span>

            {item.badge && (
              <span className="alert-badge">
                {item.badge}
              </span>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <strong>AeroSaga v1.0</strong>
        <span>Drone Mission Control</span>
      </div>
    </aside>
  );
}

export default Sidebar;