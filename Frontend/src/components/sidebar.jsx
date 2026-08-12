import { useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { icon: "🏠", name: "Dashboard" },
    { icon: "📋", name: "My Missions" },
    { icon: "🗺️", name: "Live Map" },
    
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-menu-title">MENU</div>

      <nav className="sidebar-nav">
        {menuItems.map((item, index) => (
          <div
            key={item.name}
            className={`sidebar-item ${
              index === 0 ? "active" : ""
            }`}
            onClick={() => {
              if (item.name === "Dashboard") {
                navigate("/dashboard");
              } else if (item.name === "My Missions") {
                navigate("/my-missions");
              } else if (item.name === "Live Map") {
                navigate("/live-map");
              }
            }}
          >
            <span className="sidebar-icon">
              {item.icon}
            </span>

            <span className="sidebar-name">
              {item.name}
            </span>

            {item.badge > 0 && (
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