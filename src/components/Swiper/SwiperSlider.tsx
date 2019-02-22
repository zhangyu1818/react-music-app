import React, { PureComponent } from 'react';
import styles from './index.module.scss';

export interface SwiperSliderProps {
  offset?: number;
  scale?: number;
}

class SwiperSlider extends PureComponent<SwiperSliderProps, any> {
  static defaultProps = {
    offset: 0
  };
  render() {
    const { children, offset = 0, scale = 1 } = this.props;
    const shadow = 1 - scale;
    return (
      <div
        className={styles.swiperSlider}
        style={{
          transform: `translate3d(${offset * 100}%,0,0)`
        }}
      >
        <div
          className={styles.swiperImg}
          style={{
            transform: `scale(${scale})`,
            boxShadow: `0 ${62.5 * shadow}px ${125 * shadow}px ${-25 *
              shadow}px rgba(50, 50, 73, 0.5), 0 ${37.5 * shadow}px ${75 *
              shadow}px ${-37.5 * shadow}px rgba(0, 0, 0, 0.6)`
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}
export default SwiperSlider;
