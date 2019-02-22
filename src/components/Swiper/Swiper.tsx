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
  loopDelay?: number;
  loop?: boolean;
}
interface SwiperState {
  offset: number;
  scale: number;
}
class Swiper extends PureComponent<SwiperProps, SwiperState> {
  swiperEle = React.createRef<HTMLDivElement>();
  state = { offset: 0, scale: 1 };
  // 记录开始时和移动时的坐标信息
  startPoint: TouchInfo = {
    pos: 0,
    timeStamp: 0
  };

  movePoint: TouchInfo = {
    pos: 0,
    timeStamp: 0
  };
  // 计算时需要依赖上次移动的距离和上次计算的缩放值，需要保存
  prevOffset: number = 0;
  prevScale: number = 1;
  // swiper的宽度
  swiperWidth: number = 0;
  // timer
  animateTimer: number = 0;
  autoPlayTimer: number = 0;
  // 当前的index
  currentIndex: number = 0;
  // 共有几个轮播图
  sliderCount: number = 0;
  // 自动播放
  componentDidMount() {
    this.autoPlay();
  }

  onTouchStart = ({ touches, timeStamp }: React.TouchEvent) => {
    // 保存开始时的信息
    const { pageX: pos } = touches[0];
    this.startPoint = { pos, timeStamp };
    // 计算父级宽度，因为在componentDidMount中得到的宽度有误
    this.swiperWidth = this.swiperEle.current!.getBoundingClientRect().width;
    // 用偏移量/宽度就知道当前的index
    // 因为组件设计是偏移量过半就跳到下张图，所以用四舍五入
    this.currentIndex = Math.round(this.state.offset / this.swiperWidth);
    // 清除所有的timer
    if (this.animateTimer) cancelAnimationFrame(this.animateTimer);
    if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
  };
  onTouchMove = ({ touches, timeStamp }: React.TouchEvent) => {
    // 保存移动时的信息
    const { pageX: pos } = touches[0];
    this.movePoint = { pos, timeStamp };
    // 计算偏移量和缩放值
    // 当前结果需要加上保存的上一次的计算结果
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
  autoPlay = () => {
    const { loopDelay = 5, loop } = this.props;
    if (!loop) return;
    this.autoPlayTimer = window.setInterval(() => {
      this.currentIndex--;
      if (this.currentIndex === -this.sliderCount - 1) {
        this.currentIndex = -1;
        this.prevOffset = 0;
        this.setState({ offset: 0 }, () => this.animate(this.currentIndex));
        return;
      }
      this.animate(this.currentIndex);
    }, loopDelay * 1000);
  };
  animate = (index: number) => {
    const { animateTime = 0.15 } = this.props;
    let lastTimeStamp = 0;
    if (!this.swiperWidth)
      this.swiperWidth = this.swiperEle.current!.getBoundingClientRect().width;
    const animateCallBack = (timeStamp: number) => {
      if (!lastTimeStamp) lastTimeStamp = timeStamp;
      const distance = index * this.swiperWidth - this.state.offset;
      const delta = timeStamp - lastTimeStamp;
      const moveSpeed = distance / animateTime;
      const scaleSpeed = (1 - this.prevScale) / animateTime;
      if (Math.abs(moveSpeed) < 0.0001) {
        if (this.animateTimer) cancelAnimationFrame(this.animateTimer);
        if (this.autoPlayTimer) clearInterval(this.autoPlayTimer);
        this.autoPlay();
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
          scale
        });
      } else if (index === 0) {
        tempNodeR1 = React.cloneElement(child, {
          scale
        });
      }
      return React.cloneElement(child, {
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
            transform: `translate3d(${offset}px,0,0)`,
            left: '-100%'
          }}
        >
          {this.renderSlider()}
        </div>
      </div>
    );
  }
}

export default Swiper;
