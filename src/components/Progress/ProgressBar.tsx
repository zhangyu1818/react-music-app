import React, { useRef, useState, useEffect } from 'react';
import styles from './index.module.scss';
import { clamp } from 'lodash';
import { useGesture } from 'react-with-gesture';

interface progressBarProps {
  onChange?: Function;
}

const ProgressBar = (props: progressBarProps) => {
  const [barWidth, setBarWidth] = useState(0);
  const prevBarWidth = useRef(0);
  const [wrapperRect, setWrapperRect] = useState({ width: 0, left: 0 });
  const wrapper = useRef<null | HTMLDivElement>(null);

  const bind = useGesture(({ down, event, delta: [xDelta] }) => {
    const { width } = (wrapper.current as HTMLDivElement).getBoundingClientRect();
    const offset = clamp(prevBarWidth.current + (xDelta / width) * 100, 0, 100);
    setBarWidth(offset);
    if (!down) {
      prevBarWidth.current = offset;
    }
  });
  const returnProgress = () => {
    const { onChange } = props;
    if (onChange) onChange(barWidth);
  };
  const onClickBar = ({ pageX, target }: React.MouseEvent) => {
    if ((target as HTMLElement).classList.contains(styles.button)) return;
    const offset = clamp(((pageX - wrapperRect.left) / wrapperRect.width) * 100, 0, 100);
    setBarWidth(offset);
    prevBarWidth.current = offset;
  };
  const onTouchBar = ({ touches, target }: React.TouchEvent) => {
    if ((target as HTMLElement).classList.contains(styles.button)) return;
    const [touch] = Array.from(touches);
    const { pageX } = touch;
    const offset = clamp(((pageX - wrapperRect.left) / wrapperRect.width) * 100, 0, 100);
    setBarWidth(offset);
    prevBarWidth.current = offset;
  };
  useEffect(() => {
    const { width, left } = (wrapper.current as HTMLDivElement).getBoundingClientRect();
    setWrapperRect({ width, left });
  }, []);
  useEffect(
    () => {
      returnProgress();
    },
    [barWidth]
  );
  return (
    <div className={styles.progress}>
      <div className={styles.barWrapper} ref={wrapper} onClick={onClickBar} onTouchStart={onTouchBar}>
        <div className={styles.bar} style={{ width: barWidth + '%' }}>
          <div {...bind()} className={styles.button} />
        </div>
      </div>
    </div>
  );
};
export default ProgressBar;
