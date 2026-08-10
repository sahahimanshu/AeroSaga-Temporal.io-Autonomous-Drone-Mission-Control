function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-brand">
        <div className="brand-icon">✈</div>

        <div>
          <h2>AeroSaga</h2>
          <span>Drone Mission Control</span>
        </div>
      </div>

      <div className="navbar-right">
        <div className="system-status">
          <span className="status-dot"></span>
          SYSTEM OPERATIONAL
        </div>

        <div className="admin-user">
          <div className="admin-icon">♟</div>

          <div>
            <strong>Admin User</strong>
            <span>Super Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;