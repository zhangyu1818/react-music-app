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
    const { children, scale = 1 } = this.props;
    const shadow = 1 - scale;
    return (
      <div className={styles.swiperSlider}>
        <div
          className={styles.swiperImg}
          style={{
            transform: `scale(${scale})`,
            boxShadow:
              scale !== 1
                ? `0 ${52.5 * shadow}px ${115 * shadow}px ${-15 *
                    shadow}px rgba(50, 50, 73, 0.5), 0 ${27.5 * shadow}px ${65 *
                    shadow}px ${-27.5 * shadow}px rgba(0, 0, 0, 0.6)`
                : ''
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}
export default SwiperSlider;
