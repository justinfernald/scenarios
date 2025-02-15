import { AppModel, useAppModel } from '../models/AppModel';
import { observer } from 'mobx-react-lite';
import { BaseViewModel, useViewModelConstructor } from '../utils/mobx/ViewModel';
import { makeSimpleAutoObservable } from '../utils/mobx';
import {
  borderRadius,
  center,
  flex1,
  fullHeight,
  fullSize,
  fullWidth,
  padding,
  relative,
} from '../styles';
import { FlexColumn, FlexRow } from '../components/base/Flex';
import { ButtonBase } from '@mui/material';
import { ClassNames } from '@emotion/react';
import { Scenario } from '../models/DataModel';
import { reaction, toJS } from 'mobx';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AnimateNumber } from '../components/AnimateNumber';
import NumberFlow from '@number-flow/react';

interface RootViewModelProps {
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
    const { scenarios } = this.props.appModel.dataModel;
    if (scenarios.length < 2) return;

    const leftIndex = Math.floor(Math.random() * scenarios.length);
    let rightIndex = Math.floor(Math.random() * (scenarios.length - 1));
    if (rightIndex >= leftIndex) rightIndex++;

    this.leftScenario = scenarios[leftIndex];
    this.rightScenario = scenarios[rightIndex];
  }

  setup() {
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

  vote(side: 'left' | 'right') {
    const { leftScenario, rightScenario } = this;

    const acceptedId = side === 'left' ? leftScenario?.id : rightScenario?.id;
    const rejectedId = side === 'left' ? rightScenario?.id : leftScenario?.id;

    if (!acceptedId || !rejectedId) return;

    const result = this.props.appModel.functionsModel.voteOnScenario(
      acceptedId,
      rejectedId,
    );

    result.then(({ acceptedRating, rejectedRating }) => {
      if (!leftScenario || !rightScenario) return;

      if (leftScenario?.id === acceptedId) {
        leftScenario.rating = acceptedRating;
        rightScenario.rating = rejectedRating;
      } else {
        leftScenario.rating = rejectedRating;
        rightScenario.rating = acceptedRating;
      }
    });
  }
}

interface ScenarioButtonProps {
  scenario: Scenario | null;
  onClick: () => void;
  selected: 'left' | 'right' | null;
  side: 'left' | 'right';
}

const ScenarioButton = observer((props: ScenarioButtonProps) => {
  const { scenario, onClick, selected, side } = props;

  if (!scenario) return null;

  const { scenarioText, rating, timesShown } = scenario;

  return (
    <ClassNames>
      {({ css }) => (
        <motion.div
          key={side}
          css={[
            borderRadius('xl'),
            flex1,
            fullHeight,
            {
              background:
                side === 'left'
                  ? 'linear-gradient(135deg, #e95f5f, #FF6347)'
                  : 'linear-gradient(135deg, #5f5fe9, #47B3FF)',
            },
          ]}
          initial={false}
          animate={{
            opacity: selected === side ? 1 : selected ? 0.3 : 1,
            filter:
              selected === side
                ? 'brightness(1.2)'
                : selected
                ? 'brightness(0.7)'
                : 'brightness(1)',
          }}
          exit={{ opacity: 0, y: -100, transition: { duration: 0.5, ease: 'easeInOut' } }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <ButtonBase
            css={[padding('xl'), fullSize]}
            onClick={onClick}
            TouchRippleProps={{ className: css(borderRadius('xl')) }}
          >
            <FlexColumn
              justifyContent="center"
              alignItems="center"
              css={[fullSize, padding('xl'), relative()]}
            >
              <h1
                css={{
                  textAlign: 'center',
                  textWrap: 'balance',
                  color: 'white',
                  '-webkit-text-stroke': 'rgba(0, 0, 0, 0.5) 6px',
                  paintOrder: 'stroke',
                  letterSpacing: 2,
                }}
              >
                {scenarioText}
              </h1>
              <FlexRow
                justifyContent="center"
                alignItems="center"
                css={[
                  {
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    color: 'white',
                    background: 'rgba(0,0,0,0.5)',
                    padding: 4,
                    borderRadius: 4,
                    fontSize: 20,
                    fontWeight: 'bold',
                    visibility: selected ? 'visible' : 'hidden',
                    opacity: selected ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                  },
                ]}
              >
                <NumberFlow value={Math.floor(rating)} />
                {/* {rating} */}
                {timesShown < 25 ? '?' : ''}
              </FlexRow>
            </FlexColumn>
          </ButtonBase>
        </motion.div>
      )}
    </ClassNames>
  );
});

interface ScenarioContainerProps {
  leftScenario: Scenario | null;
  rightScenario: Scenario | null;
  handleClick: (side: 'left' | 'right') => void;
  selected: 'left' | 'right' | null;
  showScenarios: boolean;
  handleExitComplete: () => void;
}

const ScenarioContainer = observer((props: ScenarioContainerProps) => {
  const {
    leftScenario,
    rightScenario,
    handleClick,
    selected,
    showScenarios,
    handleExitComplete,
  } = props;
  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
      {showScenarios && (
        <>
          <ScenarioButton
            scenario={leftScenario}
            onClick={() => handleClick('left')}
            selected={selected}
            side="left"
          />
          <ScenarioButton
            scenario={rightScenario}
            onClick={() => handleClick('right')}
            selected={selected}
            side="right"
          />
        </>
      )}
    </AnimatePresence>
  );
});

export const Root = observer(() => {
  const appModel = useAppModel();
  const vm = useViewModelConstructor(RootViewModel, { appModel });
  const [selectedButton, setSelectedButton] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showScenarios, setShowScenarios] = useState(true);

  useEffect(() => vm.setup(), [vm]);

  const handleButtonClick = (side: 'left' | 'right') => {
    if (isAnimating) return;
    setSelectedButton(side);
    setIsAnimating(true);
    vm.vote(side);
    setTimeout(() => setShowScenarios(false), 2500);
  };

  const handleExitComplete = () => {
    if (!showScenarios) {
      vm.setRandomScenarios();
      setSelectedButton(null);
      setIsAnimating(false);
      setShowScenarios(true);
    }
  };

  return (
    <FlexColumn css={[fullSize]}>
      <FlexRow css={[flex1, fullWidth, { padding: 20 }, relative()]} gap={20}>
        <FlexColumn
          justifyContent="center"
          alignItems="center"
          css={[
            center,
            {
              color: 'white',
              fontSize: 20,
              fontWeight: 'bold',
              background: '#000B',
              height: 100,
              width: 100,
              zIndex: 100,
              borderRadius: 50,
              opacity: isAnimating ? 0 : 1,
              transition: 'opacity 0.5s ease',
            },
          ]}
        >
          OR
        </FlexColumn>
        <ScenarioContainer
          leftScenario={vm.leftScenario}
          rightScenario={vm.rightScenario}
          handleClick={handleButtonClick}
          selected={selectedButton}
          showScenarios={showScenarios}
          handleExitComplete={handleExitComplete}
        />
      </FlexRow>
    </FlexColumn>
  );
});
