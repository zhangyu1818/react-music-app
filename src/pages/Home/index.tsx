import React, { useEffect, useState } from 'react';
import Swiper, { SwiperSlider } from '../../components/Swiper';
import styles from './index.module.scss';
interface Banner {
  imageUrl: string;
  [propName: string]: any;
}

const Home = () => {
  const [banners, setBanners] = useState([]);
  useEffect(() => {
    fetch('/banner')
      .then((res) => res.json())
      .then(({ banners }) => setBanners(banners));
  });
  return (
    <Swiper className={styles.banner}>
      {banners.map((banner: Banner, index) => (
        <SwiperSlider key={index}>
          <div
            style={{ backgroundImage: `url(${banner.imageUrl})` }}
            className={styles.bannerImg}
          />
        </SwiperSlider>
      ))}
    </Swiper>
  );
};
export default Home;
