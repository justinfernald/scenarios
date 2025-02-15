import { useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';

import { BaseViewModel, useViewModelConstructor } from '../utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from '../utils/mobx';
import { ScenarioDataTable } from '../components/ScenarioDataTable';
import { absolute, fullSize, relative } from '../styles';

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

  return (
    <div css={[fullSize, relative()]}>
      <div css={absolute(0, 0, 0, 0)}>
        <ScenarioDataTable />
      </div>
    </div>
  );
});
