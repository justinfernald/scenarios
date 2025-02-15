import { Outlet } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { observer } from 'mobx-react-lite';
import { FlexColumn } from '../components/base/Flex';

export const Layout = observer(() => {
  return (
    <FlexColumn
      css={[
        {
          height: '100vh',
        },
      ]}
    >
      <TopBar />
      <div css={{ flex: 1 }}>
        <Outlet />
      </div>
    </FlexColumn>
  );
});
