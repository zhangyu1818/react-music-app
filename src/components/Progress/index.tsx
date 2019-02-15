import React, { Component } from 'react';
import styles from './index.module.scss';
import { clamp } from 'lodash';

interface ProgressBarProps {
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

  componentDidMount() {
    document.addEventListener('mousemove', this.dragEvent);
    document.addEventListener('mouseup', this.onDrop);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.dragEvent);
    document.removeEventListener('mouseup', this.onDrop);
  }

  dragEvent = ({ pageX }: MouseEvent) => {
    if (this.wrapper.current === null)
      throw new Error("can't get progress width,progress wrapper is null");
    const { width } = this.wrapper.current.getBoundingClientRect();
    if (!this.isDrag) return;
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

  onDrag = ({ pageX }: React.MouseEvent) => {
    this.dragStart = pageX;
    this.isDrag = true;
    this.prevBarWidth = this.props.percent || 0;
  };

  onDrop = () => {
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
      <div className={styles.progress}>
        <div
          className={styles.barWrapper}
          ref={this.wrapper}
          onMouseDown={this.onTapBar}
        >
          <div className={styles.bar} style={{ width: percent + '%' }}>
            <div
              onMouseDown={this.onDrag}
              onMouseUp={this.onDrop}
              className={styles.button}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default ProgressBar;
