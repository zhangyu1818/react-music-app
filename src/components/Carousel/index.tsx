import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import SimpleCarousel from 'simple-carousel-js';
import styles from './index.module.scss';

const Carousel = (props: { imgList: any[]; className?: string }) => {
  const carouselEle = useRef<HTMLDivElement | null>(null);
  const carouselController = useRef<SimpleCarousel | null>(null);
  useEffect(
    () => {
      if (props.imgList.length && !carouselController.current) {
        const list = props.imgList.map((banner) => banner.imageUrl);
        carouselController.current = new SimpleCarousel(list, {
          element: `.${styles.carousel}`,
          width: '4.66667rem',
          height: '1.73333rem',
          scale: true,
          momentum: 0.6,
          arrowButton: false,
          customStyles: {
            paginationClass: styles.carouselPagination,
            dotClass: styles.dot
          }
        });
      }
      return () => {
        carouselController.current && carouselController.current.destroy();
      };
    },
    [props.imgList.length]
  );
  return (
    <div
      className={classNames(styles.carousel, props.className)}
      ref={carouselEle}
    />
  );
};

export default Carousel;
