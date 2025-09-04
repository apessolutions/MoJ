import type { Dispatch, SetStateAction } from 'react';

import { z as zod } from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
// @mui
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Step,
  Paper,
  Button,
  Stepper,
  StepLabel,
  IconButton,
  InputAdornment,
} from '@mui/material';

import { paths } from 'src/routes/paths';
// routes
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

// assets
import { PasswordIcon } from 'src/assets/icons';

import { toast } from 'src/components/snackbar';
// components
import { Iconify } from 'src/components/iconify';
import { Form, RHFTextField } from 'src/components/hook-form';

// auth
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------
const steps = ['Send OTP', 'Verify OTP', 'Reset Password'];

type StepsProps = {
  activeStep: number;
  handleBack: VoidFunction;
  handleNext: VoidFunction;
};

type EmailStepProps = StepsProps & {
  setEmail: Dispatch<SetStateAction<string>>;
};

type VerifyStepProps = StepsProps & {
  email: string;
  setCode: Dispatch<SetStateAction<string>>;
};

type ResetStepProps = StepsProps & {
  email: string;
  code: string;
};

function EmailStep({ activeStep, handleBack, handleNext, setEmail }: EmailStepProps) {
  const { forgotPassword } = useAuthContext();
  const router = useRouter();

  const ForgotPasswordSchema = zod.object({
    email: zod
      .string()
      .min(1, { message: 'Email is required!' })
      .email('Email must be a valid email address'),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data: any) => {
    toast.promise(forgotPassword?.(data.email), {
      success: () => {
        setEmail(data.email);
        handleNext();
        return 'Email sent successfully';
      },
      error: (error) => error.message || 'There is something went worng please try later',
    });
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1} sx={{ my: 5, textAlign: 'center' }}>
        <Typography variant="h3">Forgot your password?</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account and we will email you a link
          to reset your password.
        </Typography>
      </Stack>
      <Stack spacing={3} alignItems="center">
        <RHFTextField name="email" label="Email address" />
      </Stack>
      <Box sx={{ display: 'flex', mt: 3 }}>
        <Button color="inherit" onClick={() => router.back()} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />

        <LoadingButton
          variant="contained"
          // type="submit"
          loading={isSubmitting}
          onClick={onSubmit}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </LoadingButton>
      </Box>
    </Form>
  );
}

function VerifyCodeStep({ activeStep, handleBack, handleNext, email, setCode }: VerifyStepProps) {
  const { verifyCode } = useAuthContext();

  const VerifySchema = zod.object({
    email: zod
      .string()
      .min(1, { message: 'Email is required!' })
      .email('Email must be a valid email address'),
    code: zod.string().min(1, { message: 'Code is required' }),
  });

  const defaultValues = {
    email,
    code: '',
  };

  const methods = useForm({
    resolver: zodResolver(VerifySchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    toast.promise(verifyCode?.(data.email, data.code), {
      success: () => {
        setCode(data.code);
        handleNext();
        return 'Code verified successfully';
      },
      error: (error) => error.message || 'There is something went worng please try later',
    });
  });

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Verify OTP</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the code that was sent to you by email
        </Typography>
      </Stack>
      <Stack spacing={3} alignItems="center">
        <RHFTextField name="code" label="Code" />
      </Stack>
      <Box sx={{ display: 'flex', mt: 3 }}>
        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />

        <LoadingButton variant="contained" loading={isSubmitting} onClick={onSubmit}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </LoadingButton>
      </Box>
    </Form>
  );
}

function ResetPasswordStep({ code, email, activeStep, handleBack, handleNext }: ResetStepProps) {
  const { resetPassword } = useAuthContext();
  const showPassword = useBoolean();
  const router = useRouter();
  const reEnterShowPassword = useBoolean();
  const ResetPasswordSchema = zod
    .object({
      email: zod
        .string()
        .min(1, { message: 'Email is required!' })
        .email('Email must be a valid email address'),
      password: zod.string({
        required_error: 'Please Enter A Password.',
      }).min(8, 'Password must be at least 8 characters long.')
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\x20-\x2F\x3A-\x40\x5B-\x60\x7B-\x7E]).+$/, {
          message: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character',
        }),
      code: zod.string().min(1, { message: 'Code is required' }),
      passwordConfirmation: zod
        .string()
        .min(8, 'Password must be at least 8 characters')
        .min(1, { message: 'Password Confirmation is required!' }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      path: ['passwordConfirmation'],
      message: 'Passwords do not match',
    });

  const defaultValues = {
    password: '',
    passwordConfirmation: '',
    code,
    email,
  };

  const methods = useForm({
    mode: 'onChange',
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    toast.promise(resetPassword(data.email, data.code, data.password, data.passwordConfirmation), {
      success: () => {
        router.push(paths.auth.jwt.signIn);
        return 'Password changed successfully';
      },
      error: (error) => error.message || 'There is something went worng please try later',
    });
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="password"
        label="Password"
        type={showPassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={showPassword.onToggle} edge="end">
                <Iconify icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <RHFTextField
        name="passwordConfirmation"
        label="Re-Enter Password"
        type={reEnterShowPassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={reEnterShowPassword.onToggle} edge="end">
                <Iconify
                  icon={reEnterShowPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );

  return (
    <Form methods={methods} onSubmit={onSubmit}>
      <Stack spacing={1} sx={{ my: 5 }}>
        <Typography variant="h3">Reset Password</Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter your new password
        </Typography>
      </Stack>
      {renderForm}
      <Box sx={{ display: 'flex', mt: 3 }}>
        <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
          Back
        </Button>
        <Box sx={{ flexGrow: 1 }} />

        <LoadingButton variant="contained" loading={isSubmitting} onClick={onSubmit}>
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </LoadingButton>
      </Box>
    </Form>
  );
}

export function ForgotPasswordView() {
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const renderResetStep = (
    <ResetPasswordStep
      activeStep={activeStep}
      handleBack={handleBack}
      handleNext={handleNext}
      email={email}
      code={code}
    />
  );

  const renderVerifyStep = (
    <VerifyCodeStep
      activeStep={activeStep}
      handleBack={handleBack}
      handleNext={handleNext}
      email={email}
      setCode={setCode}
    />
  );

  const renderForgetStep = (
    <EmailStep
      activeStep={activeStep}
      handleBack={handleBack}
      handleNext={handleNext}
      setEmail={setEmail}
    />
  );

  const renderHead = <PasswordIcon sx={{ height: 96, m: 'auto' }} />;

  return (
    <>
      {renderHead}

      <Stepper
        sx={{
          mt: 4,
        }}
        activeStep={activeStep}
      >
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};

          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <Paper
          sx={{
            p: 3,
            minHeight: 120,
            bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
          }}
        >
          <Typography sx={{ my: 1 }}>All steps completed - you&apos;re finished</Typography>
        </Paper>
      ) : (
        <Paper
          sx={{
            minHeight: 120,
            mb: 4,
          }}
        >
          {activeStep === 0 && renderForgetStep}
          {activeStep === 1 && renderVerifyStep}
          {activeStep === 2 && renderResetStep}
        </Paper>
      )}
    </>
  );
}
