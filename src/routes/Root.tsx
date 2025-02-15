import { AppModel, useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';

import { BaseViewModel, useViewModelConstructor } from '../utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from '../utils/mobx';
import { borderRadius, flex1, fullHeight, fullSize, fullWidth, padding } from '../styles';
import { FlexColumn, FlexRow } from '../components/base/Flex';
import { ButtonBase } from '@mui/material';
import { ClassNames } from '@emotion/react';
import { Scenario } from '../models/DataModel';
import { reaction, toJS } from 'mobx';
import { useEffect } from 'react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RootViewModelProps {
  appModel: AppModel;
}

export class RootViewModel extends BaseViewModel<RootViewModelProps> {
  leftScenario: Scenario | null = null;
  rightScenario: Scenario | null = null;

  constructor(props: RootViewModelProps) {
    super(props);
    makeSimpleAutoObservable(this, {}, { autoBind: true });
  }

  setRandomScenarios() {
    const scenarios = this.props.appModel.dataModel.scenarios;

    if (scenarios.length < 2) {
      return;
    }

    const leftIndex = Math.floor(Math.random() * scenarios.length);
    let rightIndex = Math.floor(Math.random() * scenarios.length - 1);

    if (rightIndex >= leftIndex) {
      rightIndex++;
    }

    this.leftScenario = scenarios[leftIndex];
    this.rightScenario = scenarios[rightIndex];
  }

  setup() {
    // create reaction detecting if scenarios change from length 0 to something else
    return reaction(
      () => this.props.appModel.dataModel.scenarios.length,
      (value, prevValue) => {
        if ((prevValue === 0 || prevValue === undefined) && value > 0) {
          this.setRandomScenarios();
        }
      },
      { fireImmediately: true },
    );
  }
}

export const Root = observer(() => {
  const appModel = useAppModel();
  const vm = useViewModelConstructor(RootViewModel, { appModel });

  useEffect(() => {
    return vm.setup();
  }, [vm]);

  const leftScenario = toJS(vm.leftScenario);
  const rightScenario = toJS(vm.rightScenario);

  return (
    <ClassNames>
      {({ css }) => (
        <FlexColumn css={[fullSize]}>
          <FlexRow css={[fullWidth, { marginTop: 20 }]}>
            <h1 css={[fullWidth, { textAlign: 'center' }]}>Would you rather?</h1>
          </FlexRow>
          <FlexRow css={[flex1, fullWidth, { padding: 20 }]} gap={20}>
            <ButtonBase
              css={[flex1, fullHeight]}
              TouchRippleProps={{
                className: css(borderRadius('xl')),
              }}
            >
              <FlexColumn
                css={[
                  borderRadius('xl'),
                  padding('xl'),
                  fullSize,
                  { background: 'linear-gradient(135deg, #e95f5f, #FF6347)' },
                ]}
                justifyContent="center"
                alignItems="center"
              >
                <h1 css={[{ textAlign: 'center', textWrap: 'balance' }]}>
                  {leftScenario?.scenarioText}
                </h1>
              </FlexColumn>
            </ButtonBase>
            <ButtonBase
              css={[flex1, fullHeight]}
              TouchRippleProps={{
                className: css(borderRadius('xl')),
              }}
            >
              <FlexColumn
                css={[
                  borderRadius('xl'),
                  padding('xl'),
                  fullSize,
                  { background: 'linear-gradient(135deg, #5f5fe9, #47B3FF)' },
                ]}
                justifyContent="center"
                alignItems="center"
              >
                <h1 css={[{ textAlign: 'center', textWrap: 'balance' }]}>
                  {rightScenario?.scenarioText}
                </h1>
              </FlexColumn>
            </ButtonBase>
          </FlexRow>
        </FlexColumn>
      )}
    </ClassNames>
  );
});
