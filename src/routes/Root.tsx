import { useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';

import { BaseViewModel, useViewModelConstructor } from '../utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from '../utils/mobx';
import { absolute } from '../styles';
import { AuthButton } from '../components/AuthButton';
import { AddScenarioForm } from '../components/AddScenarioForm';
import { VoteOnScenarioForm } from '../components/VoteOnScenarioForm';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootViewModelProps {}

export class RootViewModel extends BaseViewModel<RootViewModelProps> {
  constructor(props: RootViewModelProps) {
    super(props);
    makeSimpleAutoObservable(this, {}, { autoBind: true });
  }
}

export const Root = observer(() => {
  const appModel = useAppModel();
  const vm = useViewModelConstructor(RootViewModel, {});

  return (
    <div css={[absolute(0, 0, 0, 0)]}>
      <h1>Welcome to the App</h1>
      <AuthButton />
      <hr />
      <AddScenarioForm />
      <hr />
      <VoteOnScenarioForm />
    </div>
  );
});
