import React, { useRef, useState } from 'react';
import styles from './index.module.scss';
import { useMyContext } from '../../context';
enum Direction {
  left = -1,
  right = 1
}
const ScrollTitle = (props: any) => {
  const titleRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(0);
  const [isScroll, setState] = useState(false);
  useMyContext({
    currentId() {
      const {
        width: parentWidth
      } = titleRef.current!.parentElement!.getBoundingClientRect();
      const { width } = titleRef.current!.getBoundingClientRect();
      if (parentWidth > width) {
        return;
      }
      animate(width - parentWidth, 2);
    }
  });
  const animate = (distance: number, time: number) => {
    let lastTimeStamp = Date.now();
    let moveDistance = 0;
    let direction = Direction.left;
    const requestCallback = () => {
      const speed = distance / time;
      const timeStamp = Date.now();
      const delta = timeStamp - lastTimeStamp;
      const temp = ((speed * delta) / 1000) * direction;
      titleRef.current!.style.transform = `translateX(${moveDistance +
        temp}px)`;
      timer.current = requestAnimationFrame(requestCallback);
    };
    requestCallback();
  };
  return (
    <div className={styles.scrollTitle} ref={titleRef}>
      {props.children}
    </div>
  );
};
export default ScrollTitle;
