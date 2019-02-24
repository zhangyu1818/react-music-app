import React, { useEffect, useState } from 'react';
import Swiper, { SwiperSlider } from '../../components/Swiper';
import styles from './index.module.scss';
import Title from '../../components/Title';
import ListItem from '../../components/ListItem';
interface Banner {
  imageUrl: string;
  [propName: string]: any;
}
interface HomeProps {
  history: any;
}
const Home = (props: HomeProps) => {
  const [banners, setBanners] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [newSong, setNewSong] = useState([]);
  useEffect(() => {
    fetch('/banner')
      .then((res) => res.json())
      .then(({ banners }) => setBanners(banners));
    fetch('/personalized')
      .then((res) => res.json())
      .then(({ result }) => setRecommend(result.slice(0, 6)));
    fetch('/personalized/newsong')
      .then((res) => res.json())
      .then(({ result }) => setNewSong(result.slice(0, 6)));
  }, []);
  const onTouchPlayList = (item: any) => {
    props.history.push('/playList', item);
  };
  return (
    <>
      <div className={styles.bannerWrapper}>
        <Swiper className={styles.banner} autoplay pagination>
          {banners.map((banner: Banner, index) => (
            <SwiperSlider key={index}>
              <div
                style={{ backgroundImage: `url(${banner.imageUrl})` }}
                className={styles.bannerImg}
              />
            </SwiperSlider>
          ))}
        </Swiper>
      </div>
      <div className={styles.recommend}>
        <Title title='推荐歌单' />
        <div className={styles.recommendList}>
          {recommend.map((item: any) => (
            <ListItem
              onTouch={() => {
                onTouchPlayList(item);
              }}
              key={item.id}
              playCount={item.playCount}
              picUrl={item.picUrl}
              title={item.name}
            />
          ))}
        </div>
      </div>
      <div className={styles.recommend}>
        <Title title='最新音乐' />
        <div className={styles.recommendList}>
          {newSong.map((item: any) => (
            <ListItem
              key={item.id}
              playCount={item.playCount}
              picUrl={item.song.album.picUrl}
              title={item.name}
            />
          ))}
        </div>
      </div>
    </>
  );
};
export default Home;
