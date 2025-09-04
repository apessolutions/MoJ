// ----------------------------------------------------------------------
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from 'src/auth/context/jwt';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import { ProgressBar } from 'src/components/progress-bar';
import {
  defaultSettings,
  SettingsDrawer,
  SettingsProvider,
} from 'src/components/settings';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { Router } from 'src/routes/sections';
import { ThemeProvider } from 'src/theme/theme-provider';

import 'src/global.css';
import 'react-phone-number-input/style.css';

import { Snackbar } from './components/snackbar';
// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  return (
    <AuthProvider>
      <SettingsProvider settings={defaultSettings}>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <MotionLazy>
              <Snackbar />
              <ProgressBar />
              <SettingsDrawer />
              <Router />
            </MotionLazy>
          </LocalizationProvider>
        </ThemeProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}
