import './App.css';
import '@blueprintjs/core/lib/css/blueprint.css';
import { AppModel, AppModelContext } from './models/AppModel';
import { Router } from './Router';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { enUS } from 'date-fns/locale/en-US';

export const globalAppModel = new AppModel();

export const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enUS}>
      <AppModelContext.Provider value={globalAppModel}>
        <Router />
      </AppModelContext.Provider>
    </LocalizationProvider>
  );
};
