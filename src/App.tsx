import './App.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { AppModel, AppModelContext } from './models/AppModel';
import { Router } from './Router';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { enUS } from 'date-fns/locale/en-US';
import { forwardRef } from 'react';
import { Link as RouterLink, LinkProps as RouterLinkProps } from 'react-router-dom';
import { createTheme, LinkProps, ThemeProvider } from '@mui/material';

// eslint-disable-next-line react/display-name
const LinkBehavior = forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props;
  return (
    <RouterLink
      ref={ref}
      to={href}
      {...other}
      css={{
        '&:hover': {
          color: 'inherit',
        },
      }}
    />
  );
});

const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
});

export const globalAppModel = new AppModel();

export const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
      <ThemeProvider theme={theme}>
        <AppModelContext.Provider value={globalAppModel}>
          <Router />
        </AppModelContext.Provider>
      </ThemeProvider>
    </LocalizationProvider>
  );
};
