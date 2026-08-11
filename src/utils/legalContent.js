// Content for the Terms & Conditions and Privacy Policy modals shown
// during registration. Kept as structured data so it renders through the
// shared LegalDocument component and is easy to update later.

export const TERMS_SECTIONS = [
  {
    heading: '1. Acceptance of Terms',
    body: [
      'By creating an account with AeroSaga, you agree to be bound by these Terms & Conditions. If you do not agree with any part of these terms, please do not register for or use the platform.',
    ],
  },
  {
    heading: '2. Account Registration',
    body: [
      'You must provide accurate, current, and complete information when creating an account, and keep that information up to date. You are responsible for safeguarding your password and for all activity that occurs under your account.',
    ],
  },
  {
    heading: '3. Permitted Use of Drone Mission Data',
    body: [
      'AeroSaga is provided for planning, monitoring, and reviewing autonomous drone missions. You agree to operate any connected drone hardware in compliance with applicable aviation authority regulations, local laws, and airspace restrictions in your region.',
      'You may not use the platform to plan or execute flights that violate no-fly zones, privacy laws, or the rights of third parties.',
    ],
  },
  {
    heading: '4. Organization and Team Access',
    body: [
      'If you register on behalf of an organization or team, you confirm that you are authorized to do so, and that your organization is responsible for the actions of its members within the platform.',
    ],
  },
  {
    heading: '5. Service Availability',
    body: [
      'We aim to keep AeroSaga available and reliable, but the service is provided on an "as is" and "as available" basis. Scheduled maintenance, updates, or unforeseen issues may cause temporary interruptions.',
    ],
  },
  {
    heading: '6. Limitation of Liability',
    body: [
      'AeroSaga is a mission-control and planning tool. We are not liable for damages, losses, or regulatory violations arising from the physical operation of drone hardware, including navigation, flight, or hardware failures.',
    ],
  },
  {
    heading: '7. Changes to These Terms',
    body: [
      'We may update these Terms from time to time. Continued use of AeroSaga after changes are posted constitutes acceptance of the revised Terms.',
    ],
  },
  {
    heading: '8. Contact',
    body: ['Questions about these Terms can be sent to support@aerosaga.example.'],
  },
];

export const PRIVACY_SECTIONS = [
  {
    heading: '1. Information We Collect',
    body: [
      'When you register, we collect the information you provide directly: full name, email address, username, phone number, role, and organization/team name (if provided). Your password is stored securely and is never visible to our staff.',
    ],
  },
  {
    heading: '2. How We Use Your Information',
    body: [
      'We use your information to create and secure your account, authenticate your logins, personalize your dashboard by role, and communicate important account or service updates.',
    ],
  },
  {
    heading: '3. Mission and Flight Data',
    body: [
      'Drone mission data associated with your account (routes, telemetry, and mission logs) is linked to your account and, where applicable, your organization, so your team can collaborate on mission planning and review.',
    ],
  },
  {
    heading: '4. Sharing of Information',
    body: [
      'We do not sell your personal information. Data may be shared with members of your own organization/team where relevant, and with service providers who help us operate the platform under confidentiality obligations.',
    ],
  },
  {
    heading: '5. Third-Party Sign-In',
    body: [
      'If you choose to continue with Google, we receive basic profile information (such as name and email) from that provider to create or match your account. We do not receive your Google password.',
    ],
  },
  {
    heading: '6. Data Security',
    body: [
      'We apply industry-standard safeguards, including encrypted password storage and access controls, to help protect your information from unauthorized access, alteration, or disclosure.',
    ],
  },
  {
    heading: '7. Your Rights',
    body: [
      'You may access, correct, or request deletion of your personal information by contacting us. You may also close your account at any time.',
    ],
  },
  {
    heading: '8. Contact',
    body: ['Questions about this Privacy Policy can be sent to privacy@aerosaga.example.'],
  },
];