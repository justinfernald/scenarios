import { useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';

import { BaseViewModel, useViewModelConstructor } from '../utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from '../utils/mobx';
import { ScenariosDataTable } from '../components/ScenarioDataTable';
import { absolute, flex1, fullSize, fullWidth, relative } from '../styles';
import { FlexColumn } from '../components/base/Flex';
import { useLoaderData, useMatch } from 'react-router-dom';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ScenarioViewModelProps {}

export class ScenarioViewModel extends BaseViewModel<ScenarioViewModelProps> {
  constructor(props: ScenarioViewModelProps) {
    super(props);
    makeSimpleAutoObservable(this, {}, { autoBind: true });
  }
}

export const Scenario = observer(() => {
  const match = useMatch('/list/:id');
  const id = match?.params.id;

  const appModel = useAppModel();
  const vm = useViewModelConstructor(ScenarioViewModel, {});

  return (
    <FlexColumn css={fullSize}>
      <div css={[fullWidth, flex1, relative()]}>
        <div css={absolute(0, 0, 0, 0)}>
          {/* <ScenarioDataTable data={appModel.dataModel.} /> */}
        </div>
      </div>
    </FlexColumn>
  );
});
