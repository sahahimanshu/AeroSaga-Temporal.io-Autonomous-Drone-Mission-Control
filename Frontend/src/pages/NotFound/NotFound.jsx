import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
  return (
    <div className="not-found">
      <h1 className="not-found__code">404</h1>
      <p className="not-found__text">This page doesn&apos;t exist yet.</p>
      <Link to="/login" className="not-found__link">
        Back to Login
      </Link>
    </div>
  );
}

export default NotFound;
