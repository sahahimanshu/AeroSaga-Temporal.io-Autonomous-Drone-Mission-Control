import { CheckCircle2 } from 'lucide-react';
import Modal from './Modal.jsx';
import Button from '../ui/Button.jsx';
import './SuccessModal.css';

/**
 * Success confirmation shown after login instead of navigating away
 * immediately. Continuing (button, Escape, or overlay click) triggers
 * the caller's existing post-login navigation.
 */
function SuccessModal({ isOpen, onContinue, message = 'You are logged in successfully!' }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onContinue}
      showCloseButton={false}
      footer={<Button onClick={onContinue}>Continue</Button>}
    >
      <div className="success-modal">
        <span className="success-modal__icon" aria-hidden="true">
          <CheckCircle2 size={40} strokeWidth={2} />
        </span>
        <p className="success-modal__message">{message}</p>
      </div>
    </Modal>
  );
}

export default SuccessModal;