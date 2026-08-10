import { ADMIN_DASHBOARD_URL } from "../config/constants";

export default function BackToAdminButton() {
  return (
    <a href={ADMIN_DASHBOARD_URL} className="back-to-admin-btn">
      ←
    </a>
  );
}