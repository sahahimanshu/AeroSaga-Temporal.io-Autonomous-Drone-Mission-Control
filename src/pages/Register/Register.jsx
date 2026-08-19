// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { User, Mail, AtSign, Phone, ShieldCheck, Building2, UserPlus } from 'lucide-react';
// import AuthCard from '../../components/common/AuthCard.jsx';
// import Brand from '../../components/common/Brand.jsx';
// import HeroVisual from '../../components/common/HeroVisual.jsx';
// import TextField from '../../components/ui/TextField.jsx';
// import SelectField from '../../components/ui/SelectField.jsx';
// import PasswordField from '../../components/ui/PasswordField.jsx';
// import PasswordStrength from '../../components/ui/PasswordStrength.jsx';
// import Checkbox from '../../components/ui/Checkbox.jsx';
// import Button from '../../components/ui/Button.jsx';
// import {
//   validateFullName,
//   validateEmail,
//   validateUsername,
//   validatePhone,
//   validatePassword,
//   validateConfirmPassword,
//   validateTermsAccepted,
//   trimValue,
// } from '../../utils/validators.js';
// import './Register.css';

// const ROLE_OPTIONS = [
//   { value: 'mission-operator', label: 'Mission Operator' },
//   { value: 'fleet-manager', label: 'Fleet Manager' },
//   { value: 'data-analyst', label: 'Data Analyst' },
//   { value: 'administrator', label: 'Administrator' },
// ];

// const INITIAL_FORM = {
//   fullName: '',
//   email: '',
//   username: '',
//   phone: '',
//   role: ROLE_OPTIONS[0].value,
//   organization: '',
//   password: '',
//   confirmPassword: '',
//   termsAccepted: false,
// };

// /** Runs every field validator and returns an { field: message } error map. */
// function validateForm(form) {
//   return {
//     fullName: validateFullName(form.fullName),
//     email: validateEmail(form.email),
//     username: validateUsername(form.username),
//     phone: validatePhone(form.phone),
//     password: validatePassword(form.password),
//     confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
//     termsAccepted: validateTermsAccepted(form.termsAccepted),
//   };
// }

// function hasErrors(errors) {
//   return Object.values(errors).some(Boolean);
// }

// function Register() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState(INITIAL_FORM);
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleChange = (event) => {
//     const { name, value, type, checked } = event.target;
//     const nextValue = type === 'checkbox' ? checked : value;
//     setForm((prev) => ({ ...prev, [name]: nextValue }));

//     // Re-validate live once a field has been touched, so errors clear as the user fixes them.
//     if (touched[name]) {
//       setErrors((prev) => ({ ...prev, ...validateForm({ ...form, [name]: nextValue }) }));
//     }
//   };

//   const handleBlur = (event) => {
//     const { name } = event.target;
//     setTouched((prev) => ({ ...prev, [name]: true }));
//     setForm((prev) => {
//       const trimmed =
//         typeof prev[name] === 'string' && name !== 'password' && name !== 'confirmPassword'
//           ? trimValue(prev[name])
//           : prev[name];
//       const updated = { ...prev, [name]: trimmed };
//       setErrors((prevErrors) => ({ ...prevErrors, ...validateForm(updated) }));
//       return updated;
//     });
//   };

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const nextErrors = validateForm(form);
//     setErrors(nextErrors);
//     setTouched({
//       fullName: true,
//       email: true,
//       username: true,
//       phone: true,
//       password: true,
//       confirmPassword: true,
//       termsAccepted: true,
//     });

//     if (hasErrors(nextErrors)) return;

//     setIsSubmitting(true);
//     // Frontend-only for now — structured so a real API call can replace this block later.
//     window.setTimeout(() => {
//       setIsSubmitting(false);
//       navigate('/login', {
//         state: { successMessage: 'Registration successful. Please login to continue.' },
//       });
//     }, 900);
//   };

//   return (
//     <AuthCard split>
//       <div className="register-visual">
//         <HeroVisual variant="panel" />
//       </div>

//       <div className="register-content">
//         <Brand />

//         <div className="register-heading">
//           <h2 className="register-heading__title">Create Account</h2>
//           <p className="register-heading__subtitle">
//             Join AeroSaga and start managing your drone missions
//           </p>
//         </div>

//         <form className="register-form" onSubmit={handleSubmit} noValidate>
//           <TextField
//             id="fullName"
//             name="fullName"
//             label="Full Name"
//             icon={User}
//             placeholder="Enter your full name"
//             autoComplete="name"
//             value={form.fullName}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.fullName ? errors.fullName : ''}
//           />

//           <TextField
//             id="email"
//             name="email"
//             type="email"
//             label="Email"
//             icon={Mail}
//             placeholder="Enter your email address"
//             autoComplete="email"
//             value={form.email}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.email ? errors.email : ''}
//           />

//           <TextField
//             id="username"
//             name="username"
//             label="Username"
//             icon={AtSign}
//             placeholder="Choose a username"
//             autoComplete="username"
//             value={form.username}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.username ? errors.username : ''}
//           />

//           <TextField
//             id="phone"
//             name="phone"
//             type="tel"
//             label="Phone Number"
//             icon={Phone}
//             placeholder="Enter your phone number"
//             autoComplete="tel"
//             value={form.phone}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.phone ? errors.phone : ''}
//           />

//           <SelectField
//             id="role"
//             name="role"
//             label="Role"
//             icon={ShieldCheck}
//             options={ROLE_OPTIONS}
//             value={form.role}
//             onChange={handleChange}
//           />

//           <TextField
//             id="organization"
//             name="organization"
//             label="Organization / Team"
//             icon={Building2}
//             placeholder="Enter organization or team name"
//             optional
//             value={form.organization}
//             onChange={handleChange}
//             onBlur={handleBlur}
//           />

//           <PasswordField
//             id="password"
//             name="password"
//             label="Password"
//             placeholder="Create a password"
//             autoComplete="new-password"
//             value={form.password}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.password ? errors.password : ''}
//             strengthMeter={<PasswordStrength password={form.password} />}
//           />

//           <PasswordField
//             id="confirmPassword"
//             name="confirmPassword"
//             label="Confirm Password"
//             placeholder="Confirm your password"
//             autoComplete="new-password"
//             value={form.confirmPassword}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.confirmPassword ? errors.confirmPassword : ''}
//           />

//           <Checkbox
//             id="termsAccepted"
//             name="termsAccepted"
//             checked={form.termsAccepted}
//             onChange={handleChange}
//             onBlur={handleBlur}
//             error={touched.termsAccepted ? errors.termsAccepted : ''}
//             label={
//               <>
//                 I agree to the <Link to="/terms">Terms &amp; Conditions</Link> and{' '}
//                 <Link to="/privacy">Privacy Policy</Link>
//               </>
//             }
//           />

//           <Button type="submit" icon={UserPlus} loading={isSubmitting}>
//             Create Account
//           </Button>

//           <p className="register-footer">
//             Already have an account? <Link to="/login">Login</Link>
//           </p>
//         </form>
//       </div>
//     </AuthCard>
//   );
// }

// export default Register;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, AtSign, Phone, ShieldCheck, Building2, UserPlus } from 'lucide-react';
import AuthCard from '../../components/common/AuthCard.jsx';
import Brand from '../../components/common/Brand.jsx';
import HeroVisual from '../../components/common/HeroVisual.jsx';
import Modal from '../../components/common/Modal.jsx';
import LegalDocument from '../../components/common/LegalDocument.jsx';
import TextField from '../../components/ui/TextField.jsx';
import SelectField from '../../components/ui/SelectField.jsx';
import PasswordField from '../../components/ui/PasswordField.jsx';
import PasswordStrength from '../../components/ui/PasswordStrength.jsx';
import Checkbox from '../../components/ui/Checkbox.jsx';
import Button from '../../components/ui/Button.jsx';
import {
  validateFullName,
  validateEmail,
  validateUsername,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateTermsAccepted,
  trimValue,
} from '../../utils/validators.js';
import { TERMS_SECTIONS, PRIVACY_SECTIONS } from '../../utils/legalContent.js';
import './Register.css';

const ROLE_OPTIONS = [
  { value: 'mission-operator', label: 'Mission Operator' },
  { value: 'fleet-manager', label: 'Fleet Manager' },
  { value: 'data-analyst', label: 'Data Analyst' },
  { value: 'administrator', label: 'Administrator' },
];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  username: '',
  phone: '',
  role: ROLE_OPTIONS[0].value,
  organization: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
};

/** Runs every field validator and returns an { field: message } error map. */
function validateForm(form) {
  return {
    fullName: validateFullName(form.fullName),
    email: validateEmail(form.email),
    username: validateUsername(form.username),
    phone: validatePhone(form.phone),
    password: validatePassword(form.password),
    confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    termsAccepted: validateTermsAccepted(form.termsAccepted),
  };
}

function hasErrors(errors) {
  return Object.values(errors).some(Boolean);
}

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Which legal document modal is open: 'terms' | 'privacy' | null.
  const [activeLegalModal, setActiveLegalModal] = useState(null);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const nextValue = type === 'checkbox' ? checked : value;
    setForm((prev) => ({ ...prev, [name]: nextValue }));

    // Re-validate live once a field has been touched, so errors clear as the user fixes them.
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, ...validateForm({ ...form, [name]: nextValue }) }));
    }
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setForm((prev) => {
      const trimmed =
        typeof prev[name] === 'string' && name !== 'password' && name !== 'confirmPassword'
          ? trimValue(prev[name])
          : prev[name];
      const updated = { ...prev, [name]: trimmed };
      setErrors((prevErrors) => ({ ...prevErrors, ...validateForm(updated) }));
      return updated;
    });
  };

  const handleSubmit = async (event) => {
  event.preventDefault();

  const nextErrors = validateForm(form);

  setErrors(nextErrors);

  setTouched({
    fullName: true,
    email: true,
    username: true,
    phone: true,
    password: true,
    confirmPassword: true,
    termsAccepted: true,
  });

  if (hasErrors(nextErrors)) return;

  setIsSubmitting(true);

  try {
    const response = await fetch('http://localhost:8082/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: form.fullName,
        email: form.email,
        password: form.password,
        role: 'USER',
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Registration failed');
    }

    console.log('Registration successful:', data);

    setIsSubmitting(false);

    navigate('/login', {
      state: {
        successMessage:
          'Registration successful. Please login to continue.',
      },
    });

  } catch (error) {
    console.error('Registration error:', error);

    setIsSubmitting(false);

    setErrors((prev) => ({
      ...prev,
      email: error.message || 'Registration failed',
    }));
  }
};
  const openTermsModal = () => setActiveLegalModal('terms');
  const openPrivacyModal = () => setActiveLegalModal('privacy');
  const closeLegalModal = () => setActiveLegalModal(null);

  return (
    <AuthCard split>
      <div className="register-visual">
        <HeroVisual variant="panel" />
      </div>

      <div className="register-content">
        <Brand />

        <div className="register-heading">
          <h2 className="register-heading__title">Create Account</h2>
          <p className="register-heading__subtitle">
            Join AeroSaga and start managing your drone missions
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <TextField
            id="fullName"
            name="fullName"
            label="Full Name"
            icon={User}
            placeholder="Enter your full name"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.fullName ? errors.fullName : ''}
          />

          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            icon={Mail}
            placeholder="Enter your email address"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.email ? errors.email : ''}
          />

          <TextField
            id="username"
            name="username"
            label="Username"
            icon={AtSign}
            placeholder="Choose a username"
            autoComplete="username"
            value={form.username}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.username ? errors.username : ''}
          />

          <TextField
            id="phone"
            name="phone"
            type="tel"
            label="Phone Number"
            icon={Phone}
            placeholder="Enter your phone number"
            autoComplete="tel"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phone ? errors.phone : ''}
          />

          <SelectField
            id="role"
            name="role"
            label="Role"
            icon={ShieldCheck}
            options={ROLE_OPTIONS}
            value={form.role}
            onChange={handleChange}
          />

          <TextField
            id="organization"
            name="organization"
            label="Organization / Team"
            icon={Building2}
            placeholder="Enter organization or team name"
            optional
            value={form.organization}
            onChange={handleChange}
            onBlur={handleBlur}
          />

          <PasswordField
            id="password"
            name="password"
            label="Password"
            placeholder="Create a password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.password ? errors.password : ''}
            strengthMeter={<PasswordStrength password={form.password} />}
          />

          <PasswordField
            id="confirmPassword"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.confirmPassword ? errors.confirmPassword : ''}
          />

          <Checkbox
            id="termsAccepted"
            name="termsAccepted"
            checked={form.termsAccepted}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.termsAccepted ? errors.termsAccepted : ''}
            label={
              <>
                I agree to the{' '}
                <button type="button" className="inline-link" onClick={openTermsModal}>
                  Terms &amp; Conditions
                </button>{' '}
                and{' '}
                <button type="button" className="inline-link" onClick={openPrivacyModal}>
                  Privacy Policy
                </button>
              </>
            }
          />

          <Button type="submit" icon={UserPlus} loading={isSubmitting}>
            Create Account
          </Button>

          <p className="register-footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>

      <Modal
        isOpen={activeLegalModal === 'terms'}
        onClose={closeLegalModal}
        title="Terms & Conditions"
        size="lg"
        footer={<Button onClick={closeLegalModal}>Accept</Button>}
      >
        <LegalDocument sections={TERMS_SECTIONS} effectiveDate="August 10, 2026" />
      </Modal>

      <Modal
        isOpen={activeLegalModal === 'privacy'}
        onClose={closeLegalModal}
        title="Privacy Policy"
        size="lg"
        footer={<Button onClick={closeLegalModal}>Accept</Button>}
      >
        <LegalDocument sections={PRIVACY_SECTIONS} effectiveDate="August 10, 2026" />
      </Modal>
    </AuthCard>
  );
}

export default Register;