import React, { PureComponent } from 'react';
import styles from './index.module.scss';
import classNames from 'classnames';
import { range } from 'lodash';

interface TouchInfo {
  pos: number;
  timeStamp: number;
}
interface SwiperProps {
  switchOffset?: number;
  criticalSpeed?: number;
  animateTime?: number;
  className?: string;
  delay?: number;
  autoplay?: boolean;
  pagination?: boolean;
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
  prevOffset = 0;
  prevScale = 1;
  // swiper的宽度
  swiperWidth = 0;
  // timer
  animateTimer = 0;
  autoPlayTimer = 0;
  // 当前的index
  currentIndex = 0;
  // 共有几个轮播图
  sliderCount = 0;
  // 自动播放
  componentDidMount() {
    this.autoPlay();
  }
  componentWillUnmount() {
    clearInterval(this.autoPlayTimer);
    cancelAnimationFrame(this.animateTimer);
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
    // switchOffset是轮播切换的值，0.5代表拖拽过半就会换下张图
    // criticalSpeed是轮播切换的临界速度，如果速度大于0.4就会切换
    const { switchOffset = 0.5, criticalSpeed = 0.4 } = this.props;
    this.prevOffset = this.state.offset;
    this.prevScale = this.state.scale;
    // 计算路程时间速度
    const distance = this.movePoint.pos - this.startPoint.pos;
    const timeStamp = this.movePoint.timeStamp - this.startPoint.timeStamp;
    const speed = distance / timeStamp;
    // 路程和时间判断是否要切换下一张轮播
    if (
      Math.abs(distance) > this.swiperWidth * switchOffset ||
      Math.abs(speed) > criticalSpeed
    )
      // 速度判断是切换上一张还是下一张
      this.currentIndex += speed < 0 ? -1 : 1;
    // 无限滚动的判断
    // 如果当前的位置是临时的第一张（图片是最后一张），就保留缩放的大小，只改变位置信息，无缝切换到最后一张，但是图片一样，看不出来
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
    }
    // 同理判断临时的最后一张
    else if (this.currentIndex === -this.sliderCount) {
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
    // 其他情况直接做动画
    this.animate(this.currentIndex);
  };
  // 自动播放
  autoPlay = () => {
    const { delay = 5, autoplay } = this.props;
    if (!autoplay) return;
    this.autoPlayTimer = window.setInterval(() => {
      this.currentIndex--;
      if (this.currentIndex === -this.sliderCount - 1) {
        this.currentIndex = -1;
        this.prevOffset = 0;
        this.setState({ offset: 0 }, () => this.animate(this.currentIndex));
        return;
      }
      this.animate(this.currentIndex);
    }, delay * 1000);
  };
  // 动画
  animate = (index: number) => {
    const { animateTime = 0.15 } = this.props;
    let lastTimeStamp = 0;
    // 由于是点击的时候才获取父级宽度，在自动播放的时候需要加个判断
    if (!this.swiperWidth)
      this.swiperWidth = this.swiperEle.current!.getBoundingClientRect().width;
    // requestAnimationFrame的callback
    const animateCallBack = (timeStamp: number) => {
      if (!lastTimeStamp) lastTimeStamp = timeStamp;
      // 计算公式是速度*时间
      // 先计算出还需要走的距离
      const distance = index * this.swiperWidth - this.state.offset;
      // 两次动画之间的时间差
      const delta = timeStamp - lastTimeStamp;
      const moveSpeed = distance / animateTime;
      const scaleSpeed = (1 - this.prevScale) / animateTime;
      // 动画完成后结束动画
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
          // 应用动画后再保存值
          this.prevOffset = this.state.offset;
          this.prevScale = this.state.scale;
          lastTimeStamp = timeStamp;
          this.animateTimer = requestAnimationFrame(animateCallBack);
        }
      );
    };
    animateCallBack(0);
  };
  // render轮播slider
  // 无限滚动的原理是在轮播图前后各加两张假的图片
  // 最前加上最后一张的图片，当向左滚动，从index = 0到index=-1时，就是从第一张到了最前一张假的图片
  // 这时候将坐标无缝切换到真正的最后一张，由于图片一样是看不出来的
  renderSlider = () => {
    const { children } = this.props;
    const { scale } = this.state;
    this.sliderCount = React.Children.count(children);
    // 创建两个假的节点
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
  // 导航条
  renderPagination = () => {
    if (!this.props.pagination) return;
    const dots = range(this.sliderCount).map((index) => (
      <span
        key={index}
        className={classNames(styles.dot, {
          [styles.current]: index === Math.abs(this.currentIndex)
        })}
      />
    ));
    return <div className={styles.swiperPagination}>{dots}</div>;
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
        {this.renderPagination()}
      </div>
    );
  }
}

export default Swiper;
