import React, { PureComponent } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';

interface TouchInfo {
  pos: number;
  timeStamp: number;
}
interface SwiperProps {
  switchOffset?: number;
  criticalSpeed?: number;
  animateTime?: number;
  className?: string;
}
class Swiper extends PureComponent<SwiperProps, any> {
  swiperEle = React.createRef<HTMLDivElement>();
  startPoint: TouchInfo = {
    pos: 0,
    timeStamp: 0
  };
  movePoint: TouchInfo = {
    pos: 0,
    timeStamp: 0
  };

  prevOffset: number = 0;
  prevScale: number = 1;
  state = { offset: 0, scale: 1 };
  swiperWidth: number = 0;
  animateTimer: number = 0;
  currentIndex: number = 0;
  sliderCount: number = 0;
  onTouchStart = ({ touches, timeStamp }: React.TouchEvent) => {
    const { pageX: pos } = touches[0];
    this.startPoint = { pos, timeStamp };
    this.swiperWidth = this.swiperEle.current!.getBoundingClientRect().width;
    this.currentIndex = Math.round(this.state.offset / this.swiperWidth);
    if (this.animateTimer) cancelAnimationFrame(this.animateTimer);
  };
  onTouchMove = ({ touches, timeStamp }: React.TouchEvent) => {
    const { pageX: pos } = touches[0];
    this.movePoint = { pos, timeStamp };
    const distance = this.movePoint.pos - this.startPoint.pos;
    const offset = this.prevOffset + distance;
    const scale = this.prevScale - Math.abs(distance) / this.swiperWidth / 2;
    this.setState({
      offset,
      scale
    });
  };

  onTouchEnd = () => {
    const { switchOffset = 0.5, criticalSpeed = 0.4 } = this.props;
    this.prevOffset = this.state.offset;
    this.prevScale = this.state.scale;
    const distance = this.movePoint.pos - this.startPoint.pos;
    const timeStamp = this.movePoint.timeStamp - this.startPoint.timeStamp;
    const speed = distance / timeStamp;
    if (
      Math.abs(distance) > this.swiperWidth * switchOffset ||
      Math.abs(speed) > criticalSpeed
    )
      this.currentIndex += speed < 0 ? -1 : 1;
    if (this.currentIndex === 1) {
      this.currentIndex = 1 - this.sliderCount;
      this.setState(
        {
          offset:
            this.currentIndex * this.swiperWidth +
            (this.prevOffset - this.swiperWidth)
        },
        () => {
          this.prevOffset = this.state.offset;
          this.animate(this.currentIndex);
        }
      );
      return;
    } else if (this.currentIndex === -this.sliderCount) {
      this.currentIndex = 0;
      this.setState(
        {
          offset: this.sliderCount * this.swiperWidth + this.prevOffset
        },
        () => {
          this.prevOffset = this.state.offset;
          this.animate(this.currentIndex);
        }
      );
      return;
    }
    this.animate(this.currentIndex);
  };
  animate = (index: number) => {
    const { animateTime = 0.15 } = this.props;
    let lastTimeStamp = 0;
    const animateCallBack = (timeStamp: number) => {
      if (!lastTimeStamp) lastTimeStamp = timeStamp;
      const distance = index * this.swiperWidth - this.state.offset;
      const delta = timeStamp - lastTimeStamp;
      const moveSpeed = distance / animateTime;
      const scaleSpeed = (1 - this.prevScale) / animateTime;
      if (Math.abs(moveSpeed) < 0.0001) {
        if (this.animateTimer) cancelAnimationFrame(this.animateTimer);
        return;
      }
      this.setState(
        {
          offset: this.prevOffset + moveSpeed * (delta / 1000),
          scale: this.prevScale + scaleSpeed * (delta / 1000)
        },
        () => {
          this.prevOffset = this.state.offset;
          this.prevScale = this.state.scale;
          lastTimeStamp = timeStamp;
          this.animateTimer = requestAnimationFrame(animateCallBack);
        }
      );
    };
    animateCallBack(0);
  };
  renderSlider = () => {
    const { children } = this.props;
    const { scale } = this.state;
    this.sliderCount = React.Children.count(children);
    let tempNodeL1 = null,
      tempNodeR1 = null;
    const cloneChildren = React.Children.map(children, (child: any, index) => {
      if (index === this.sliderCount - 1) {
        tempNodeL1 = React.cloneElement(child, {
          offset: -1,
          scale
        });
      } else if (index === 0) {
        tempNodeR1 = React.cloneElement(child, {
          offset: this.sliderCount,
          scale
        });
      }
      return React.cloneElement(child, {
        offset: index,
        scale
      });
    });
    return [tempNodeL1, ...cloneChildren, tempNodeR1];
  };
  static defaultProps: {
    switchOffset: number;
    animateTime: number;
    criticalSpeed: number;
  };
  render() {
    const { offset } = this.state;
    const { className } = this.props;
    return (
      <div
        ref={this.swiperEle}
        className={classNames(styles.swiper, className)}
        onTouchStart={this.onTouchStart}
        onTouchMove={this.onTouchMove}
        onTouchEnd={this.onTouchEnd}
      >
        <div
          className={styles.animate}
          style={{
            transform: `translate3d(${offset}px,0,0)`
          }}
        >
          {this.renderSlider()}
        </div>
      </div>
    );
  }
}

export default Swiper;
