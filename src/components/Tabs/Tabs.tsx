import React, { PureComponent } from 'react';
import styles from './tabs.module.scss';
import classNames from 'classnames';
import { clamp } from 'lodash-es';
// @ts-ignore
import TWEEN from '@tweenjs/tween.js';
interface TabsProp {
  className?: string;
}
class Tabs extends PureComponent<TabsProp, any> {
  wrapperEle: HTMLDivElement | null = null;
  wrapperWidth: number = 0;
  dragStart: number = 0;
  prevOffset: number = 0;
  isDrag: boolean = false;
  state = {
    offset: 0
  };
  onTouchStart = ({ touches }: React.TouchEvent) => {
    const { pageX } = touches[0];
    this.dragStart = pageX;
    this.wrapperWidth = this.wrapperEle!.getBoundingClientRect().width;
    this.isDrag = true;
  };
  onTouchMove = ({ touches }: React.TouchEvent) => {
    const childCount = React.Children.count(this.props.children);
    const { pageX } = touches[0];
    const offset = clamp(
      this.prevOffset + ((pageX - this.dragStart) / this.wrapperWidth) * 100,
      -(childCount - 1) * 100,
      0
    );
    this.setState({ offset });
  };

  animate = () => {};
  onTouchEnd = () => {
    const { offset } = this.state;
    this.prevOffset = offset;
    this.animate();
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
