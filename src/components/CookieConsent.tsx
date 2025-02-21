import { useEffect, useState } from 'react';
import { setAnalyticsCollectionEnabled } from 'firebase/analytics';
import { analytics } from '../firebaseConfig';
import { useCookies } from 'react-cookie';
import { Button, Box, Typography, Paper, Slide, Stack, Backdrop } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { FlexRow } from './base/Flex';

export const CookieConsent = observer(() => {
  const [cookies, setCookie] = useCookies(['cookieConsent']);
  const [showBanner, setShowBanner] = useState(false);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    if (cookies.cookieConsent === undefined) {
      setShowBanner(true);
    } else {
      setAnalyticsCollectionEnabled(analytics, cookies.cookieConsent === 'accepted');
    }
  }, [cookies.cookieConsent]);

  const handleConsent = (accepted: boolean) => {
    setAnimatingOut(true);
    setTimeout(() => {
      setCookie('cookieConsent', accepted ? 'accepted' : 'declined', { path: '/' });
      setShowBanner(false);
      setAnalyticsCollectionEnabled(analytics, accepted);
    }, 300); // Matches Slide exit animation
  };

  if (!showBanner) return null;

  return (
    <Box>
      {/* Backdrop to block interactions */}
      <Backdrop
        open={!animatingOut}
        sx={{ zIndex: 1200, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      />

      {/* Cookie Banner */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          left: 0,
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1301, // Above the backdrop
        }}
      >
        <Slide direction="up" in={!animatingOut} mountOnEnter unmountOnExit>
          <Paper
            elevation={6}
            sx={{
              width: '90%',
              maxWidth: 500,
              p: 2,
              borderRadius: 2,
              textAlign: 'center',
              backgroundColor: '#f8f9fa',
            }}
          >
            <FlexRow alignItems="center">
              <Typography variant="body1" sx={{ textWrap: 'balance' }}>
                We use cookies to enhance your experience. Do you accept our use of
                cookies?
              </Typography>
              <Stack sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleConsent(true)}
                >
                  Accept
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleConsent(false)}
                >
                  Decline
                </Button>
              </Stack>
            </FlexRow>
          </Paper>
        </Slide>
      </Box>
    </Box>
  );
});
