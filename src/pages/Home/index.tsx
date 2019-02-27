import React, { useContext, useEffect, useRef, useState } from 'react';
import Swiper, { SwiperSlider } from '../../components/Swiper';
import styles from './index.module.scss';
import Title from '../../components/Title';
import ListItem from '../../components/SquareListItem';
import BScroll from 'better-scroll';
import { useMyContext } from '../../context';
interface Banner {
  imageUrl: string;
  [propName: string]: any;
}
interface HomeProps {
  [propName: string]: any;
}

const Home = (props: HomeProps) => {
  useMyContext({
    playerSize() {
      scrollController.current && scrollController.current.refresh();
    }
  });
  const [banners, setBanners] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [newSong, setNewSong] = useState([]);
  const scrollEle = useRef<HTMLDivElement | null>(null);
  const scrollController = useRef<BScroll | null>(null);
  useEffect(() => {
    fetch('/banner')
      .then((res) => res.json())
      .then(({ banners }) => setBanners(banners));
    fetch('/personalized')
      .then((res) => res.json())
      .then(({ result }) => setRecommend(result.slice(0, 6)));
    fetch('/album/newest')
      .then((res) => res.json())
      .then(({ albums }) => setNewSong(albums.slice(0, 6)));
    if (scrollEle.current) {
      scrollController.current = new BScroll(scrollEle.current, {
        click: true,
        observeDOM: false
      });
      return () => {
        scrollController.current && scrollController.current.destroy();
      };
    }
  }, []);
  return (
    <div className={styles.home} ref={scrollEle}>
      <div className={styles.homeScroll}>
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
                onClick={() => {
                  props.history.push('/playList', item);
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
          <Title title='最新专辑' />
          <div className={styles.recommendList}>
            {newSong.map((item: any) => (
              <ListItem
                onClick={() => {
                  props.history.push('/album', item);
                }}
                key={item.id}
                picUrl={item.blurPicUrl}
                title={item.name}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
