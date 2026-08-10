import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Brand from '../../components/common/Brand.jsx';
import Button from '../../components/ui/Button.jsx';
import './Dashboard.css';

/**
 * Placeholder landing page for a successful login. No backend is wired up
 * yet — this exists purely so the auth flow has somewhere to go.
 */
function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard__card">
        <Brand />
        <h2 className="dashboard__title">You&apos;re logged in</h2>
        <p className="dashboard__subtitle">
          Mission control dashboard isn&apos;t built yet — this screen is a placeholder for the
          real app.
        </p>
        <div className="dashboard__actions">
          <Button variant="secondary" icon={LogOut} onClick={() => navigate('/login')}>
            Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
