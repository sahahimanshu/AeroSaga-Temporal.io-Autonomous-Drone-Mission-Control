import './AuthCard.css';

/**
 * Rounded, bordered shell shared by the Login and Register pages.
 * `split` renders a two-column layout (image + content) on wide screens.
 */
function AuthCard({ children, split = false }) {
  return (
    <div className="auth-page">
      <div className={`auth-card ${split ? 'auth-card--split' : ''}`}>{children}</div>
    </div>
  );
}

export default AuthCard;
