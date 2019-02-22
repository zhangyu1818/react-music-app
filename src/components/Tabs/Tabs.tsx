import React, { PureComponent } from 'react';
import styles from './tabs.module.scss';
import classNames from 'classnames';
import { clamp } from 'lodash-es';
interface TabsProp {
  className?: string;
  switchOffset?: number;
  criticalSpeed?: number;
  animateTime?: number;
}
interface TabsState {
  offset: number;
}
interface TouchInfo {
  pos: number;
  timeStamp: number;
}
class Tabs extends PureComponent<TabsProp, TabsState> {
  wrapperEle: HTMLDivElement | null = null;
  wrapperWidth: number = 0;
  dragStart: TouchInfo = {
    pos: 0,
    timeStamp: 0
  };
  dragMove: TouchInfo = {
    pos: 0,
    timeStamp: 0
  };
  prevOffset: number = 0;
  isDrag: boolean = false;
  animateTimer: number | undefined;
  state = {
    offset: 0
  };
  onTouchStart = ({ touches, timeStamp }: React.TouchEvent) => {
    const { pageX } = touches[0];
    this.dragStart = {
      pos: pageX,
      timeStamp
    };
    this.wrapperWidth = this.wrapperEle!.getBoundingClientRect().width;
    this.isDrag = true;
    if (this.animateTimer) cancelAnimationFrame(this.animateTimer);
  };
  onTouchMove = ({ touches, timeStamp }: React.TouchEvent) => {
    const childCount = React.Children.count(this.props.children);
    const { pageX } = touches[0];
    this.dragMove = {
      pos: pageX,
      timeStamp
    };
    const offset = clamp(
      this.prevOffset +
        ((pageX - this.dragStart.pos) / this.wrapperWidth) * 100,
      -(childCount - 1) * 100,
      0
    );
    this.setState({ offset });
  };

  onTouchEnd = () => {
    const {
      switchOffset = 0.3,
      criticalSpeed = 0.4,
      animateTime = 0.1
    } = this.props;
    const timeStamp = this.dragMove.timeStamp - this.dragStart.timeStamp;
    const distance = this.dragMove.pos - this.dragStart.pos;
    const speed = distance / timeStamp;
    const { offset } = this.state;
    this.prevOffset = offset;
    const tempOffset = Math.abs(offset / 100);
    let currentIndex =
      speed < 0
        ? tempOffset > switchOffset
          ? Math.ceil(tempOffset)
          : Math.floor(tempOffset)
        : tempOffset > 1 - switchOffset
        ? Math.ceil(tempOffset)
        : Math.floor(tempOffset);
    if (speed > criticalSpeed) {
      currentIndex = Math.floor(tempOffset);
    } else if (speed < -criticalSpeed) {
      currentIndex = Math.ceil(tempOffset);
    }
    this.animate(currentIndex, animateTime);
  };

  animate = (index: number, time: number) => {
    let lastTimeStamp: number = 0;
    const animateCallBack = (timeStamp: number) => {
      if (!lastTimeStamp) lastTimeStamp = timeStamp;
      const distance = index * -100 - this.state.offset;
      const speed = distance / time;
      const delta = timeStamp - lastTimeStamp;
      if (Math.abs(speed) < 0.0001) {
        if (this.animateTimer) cancelAnimationFrame(this.animateTimer);
        return;
      }
      this.setState(
        { offset: this.prevOffset + speed * (delta / 1000) },
        () => {
          this.prevOffset = this.state.offset;
          lastTimeStamp = timeStamp;
          this.animateTimer = requestAnimationFrame(animateCallBack);
        }
      );
    };
    animateCallBack(0);
  };

  render() {
    const { className, children } = this.props;
    const { offset } = this.state;
    return (
      <div
        className={classNames(styles.tabsWrapper, className)}
        ref={(ele) => (this.wrapperEle = ele)}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        <div
          className={styles.tabPaneScroll}
          style={{
            transform: `translateX(${offset}%)`
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}
export default Tabs;
