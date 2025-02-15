import NumberFlow from '@number-flow/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FlexRow } from './base/Flex';

export interface AnimateNumberProps {
  className?: string;
  valueClassName?: string;
  diffClassName?: string;

  value: number;
  diff?: number;
  durationMs: number;
  durationMsToShift?: number;
  shift?: boolean;
}

export const AnimateNumber = (props: AnimateNumberProps) => {
  const {
    className,
    valueClassName,
    diffClassName,

    value,
    diff,
    durationMs,
    shift,
    durationMsToShift,
  } = props;

  const [internalShift, setInternalShift] = useState(false);
  // const [valueWidth, setValueWidth] = useState(0);
  const [diffWidth, setDiffWidth] = useState(0);

  const valueRef = useRef<HTMLDivElement>(null);
  const diffRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInternalShift(false);

    if (shift !== undefined) {
      return;
    }

    const timeout = setTimeout(() => {
      setInternalShift(true);
    }, durationMsToShift ?? 2_500);

    return () => {
      clearTimeout(timeout);
    };
  }, [shift, durationMsToShift, diff]);
  const usedShift = shift ?? internalShift;

  // useLayoutEffect(() => {
  //   if (valueRef.current) {
  //     setValueWidth(valueRef.current.getBoundingClientRect().width);
  //   }
  // }, [value]);

  useLayoutEffect(() => {
    if (diffRef.current) {
      setDiffWidth(diffRef.current.getBoundingClientRect().width);
    }
  }, [diff]);

  const gap = 10;

  return (
    <FlexRow className={className} gap={gap}>
      <AnimatePresence>
        <motion.div
          key="main-number"
          layout
          transition={{ duration: 0.3, type: 'spring' }}
        >
          <motion.div
            key="main-number-nested"
            className={valueClassName}
            ref={valueRef}
            initial={{ scale: 1 }}
            animate={{ scale: diff && usedShift ? [1, 1.2, 1] : 1 }}
            transition={{ duration: durationMs / 1000 }}
            style={{ display: 'inline-block' }}
          >
            <NumberFlow value={usedShift ? value + (diff ?? 0) : value} />
          </motion.div>
        </motion.div>
        {diff && !usedShift ? (
          <motion.div
            key="diff-number"
            layout
            transition={{ duration: 0.3, type: 'spring' }}
          >
            <motion.div
              key="diff-number-nested"
              layout
              className={diffClassName}
              ref={diffRef}
              initial={{ x: 0, opacity: 1 }}
              exit={{
                x: -diffWidth - gap,
                opacity: 0,
              }}
              transition={{ duration: durationMs / 1000 }}
            >
              {diff >= 0 ? '+' : ''}
              <NumberFlow value={usedShift ? 0 : diff} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </FlexRow>
  );
};
