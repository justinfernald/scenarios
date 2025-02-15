import { useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';

import { BaseViewModel, useViewModelConstructor } from '../utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from '../utils/mobx';
import { ScenariosDataTable } from '../components/ScenarioDataTable';
import { absolute, flex1, fullSize, fullWidth, relative } from '../styles';
import { FlexColumn } from '../components/base/Flex';
import { AddScenarioForm } from '../components/AddScenarioForm';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ListViewModelProps {}

export class ListViewModel extends BaseViewModel<ListViewModelProps> {
  constructor(props: ListViewModelProps) {
    super(props);
    makeSimpleAutoObservable(this, {}, { autoBind: true });
  }
}

export const List = observer(() => {
  const appModel = useAppModel();
  const vm = useViewModelConstructor(ListViewModel, {});

  const { authModel } = appModel;

  return (
    <FlexColumn css={fullSize}>
      {authModel.isLoggedIn && (
        <FlexColumn css={[fullWidth]} alignItems="center">
          <AddScenarioForm />
        </FlexColumn>
      )}
      <div css={[fullWidth, flex1, relative()]}>
        <div css={absolute(0, 0, 0, 0)}>
          <ScenariosDataTable />
        </div>
      </div>
    </FlexColumn>
  );
});
