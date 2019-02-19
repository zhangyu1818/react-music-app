import React, { Component } from 'react';
import { clamp } from 'lodash';
import classNames from 'classnames';
import styles from './index.module.scss';

interface ProgressBarProps {
  wrapperClassName?: string;
  onChange?: Function;
  percent: number;
}
interface ProgressBarState {
  barWidth: number;
}
/**
 * wrapper:外层div，需要获得外层div宽度计算百分比
 * dragStart:拖拽起始点
 * isDrag:是否开始拖拽
 * prevBarWidth:上一次拖拽的宽度
 * barWidth:当前进度条宽度
 */
class ProgressBar extends Component<ProgressBarProps, ProgressBarState> {
  wrapper: React.RefObject<HTMLDivElement> = React.createRef();
  dragStart: number = 0;
  isDrag: boolean = false;
  prevBarWidth: number = 0;
  state = {
    barWidth: 0
  };

  progressChange = () => {
    const { onChange } = this.props;
    if (onChange) onChange(this.state.barWidth);
  };

  onDrag = ({ touches }: React.TouchEvent) => {
    const { pageX } = touches[0];
    this.dragStart = pageX;
    this.isDrag = true;
    this.prevBarWidth = this.props.percent || 0;
  };

  onMove = ({ touches }: React.TouchEvent) => {
    if (!this.isDrag) return;
    const { pageX } = touches[0];
    if (this.wrapper.current === null)
      throw new Error("can't get progress width,progress wrapper is null");
    const { width } = this.wrapper.current.getBoundingClientRect();
    this.setState(
      {
        barWidth: clamp(
          this.prevBarWidth + ((pageX - this.dragStart) / width) * 100,
          0,
          100
        )
      },
      () => this.progressChange()
    );
  };

  onEnd = () => {
    this.isDrag = false;
    this.prevBarWidth = this.state.barWidth;
  };

  onTapBar = ({ pageX }: React.MouseEvent) => {
    if (this.wrapper.current === null)
      throw new Error("can't get progress width,progress wrapper is null");
    const { width, left } = this.wrapper.current.getBoundingClientRect();
    this.setState(
      { barWidth: clamp(((pageX - left) / width) * 100, 0, 100) },
      () => this.progressChange()
    );
  };

  render() {
    const percent = this.isDrag ? this.state.barWidth : this.props.percent;
    return (
      <div className={classNames(styles.progress, this.props.wrapperClassName)}>
        <div
          className={styles.barWrapper}
          ref={this.wrapper}
          onClick={this.onTapBar}
        >
          <div className={styles.bar} style={{ width: percent + '%' }}>
            <div
              className={styles.button}
              onTouchStart={this.onDrag}
              onTouchMove={this.onMove}
              onTouchEnd={this.onEnd}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default ProgressBar;
