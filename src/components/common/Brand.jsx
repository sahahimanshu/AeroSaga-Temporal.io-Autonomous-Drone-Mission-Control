import { Bird } from 'lucide-react';
import './Brand.css';

/**
 * Shared AeroSaga wordmark used at the top of both auth pages.
 */
function Brand() {
  return (
    <div className="brand">
      <span className="brand__icon" aria-hidden="true">
        <Bird size={22} strokeWidth={2} />
      </span>
      <div className="brand__text">
        <h1 className="brand__name">
          Aero<span className="brand__name-accent">Saga</span>
        </h1>
        <p className="brand__tagline">Autonomous Drone Mission Control</p>
      </div>
    </div>
  );
}

export default Brand;
