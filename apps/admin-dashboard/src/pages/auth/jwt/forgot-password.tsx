import { Helmet } from 'react-helmet-async';

import { ForgotPasswordView } from 'src/sections/auth/jwt';
// sections
// ----------------------------------------------------------------------
export default function ForgetPasswordPage() {
  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>
      <ForgotPasswordView />
    </>
  );
}
