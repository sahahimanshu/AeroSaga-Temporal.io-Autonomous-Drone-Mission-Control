export default function EmergencyAbortButton({ onAbort }) {
  return (
    <button className="emergency-abort-btn" onClick={onAbort}>
      ⚠ EMERGENCY ABORT MISSION
    </button>
  );
}