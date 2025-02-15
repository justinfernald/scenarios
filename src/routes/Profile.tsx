import { useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';

import { BaseViewModel, useViewModelConstructor } from '../utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from '../utils/mobx';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProfileViewModelProps {}

export class ProfileViewModel extends BaseViewModel<ProfileViewModelProps> {
  constructor(props: ProfileViewModelProps) {
    super(props);
    makeSimpleAutoObservable(this, {}, { autoBind: true });
  }
}

export const Profile = observer(() => {
  const appModel = useAppModel();
  const vm = useViewModelConstructor(ProfileViewModel, {});

  return (
    <div>
      <h1>Profile</h1>
    </div>
  );
});
