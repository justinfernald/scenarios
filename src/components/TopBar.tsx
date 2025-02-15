import { observer } from 'mobx-react-lite';
import { FlexRow } from './base/Flex';
import { AppBar, Button, IconButton } from '@mui/material';
import { fullSize, padding } from '../styles';
import { useAppModel } from '../models/AppModel';
import { Google, List, Logout, Person } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export const TopBar = observer(() => {
  const appModel = useAppModel();
  const { authModel } = appModel;

  return (
    <AppBar position="static" css={[{ height: 50 }]}>
      <FlexRow
        css={[fullSize, padding('md')]}
        alignItems="center"
        justifyContent="space-between"
      >
        <FlexRow alignItems="center">
          <Link
            to="/"
            css={{
              textDecoration: 'none',
              color: 'white',
              outline: 'none',
              '&:hover': {
                textDecoration: 'none',
                color: '#f1f1f1',
              },
            }}
          >
            <h2>Scenarios 😖</h2>
          </Link>
        </FlexRow>
        <FlexRow alignItems="center">
          <Button href="/list" color="inherit" startIcon={<List />}>
            List
          </Button>

          {authModel.isLoggedIn ? (
            <>
              <IconButton color="inherit" onClick={authModel.signOut}>
                <Logout />
              </IconButton>
            </>
          ) : (
            <Button
              color="inherit"
              startIcon={<Google />}
              onClick={authModel.signInWithGoogle}
            >
              Login
            </Button>
          )}
        </FlexRow>
      </FlexRow>
    </AppBar>
  );
});
