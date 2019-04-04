import React, { useEffect, useRef, useState } from 'react';
import Carousel from '../../components/Carousel';
import styles from './index.module.scss';
import Title from '../../components/Title';
import SquareListItem from '../../components/SquareListItem';
import BScroll from 'better-scroll';
import { useMyContext } from '../../context';
import request from '../../utils/request';

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
    const fetchData = async () => {
      await request('/banner').then(({ banners }) => setBanners(banners));
      await request('/personalized').then(({ result }) =>
        setRecommend(result.slice(0, 6))
      );
      await request('/album/newest').then(({ albums }) =>
        setNewSong(albums.slice(0, 6))
      );
    };
    fetchData().then(() => {
      if (scrollEle.current) {
        scrollController.current = new BScroll(scrollEle.current, {
          click: true,
          observeDOM: false
        });
      }
    });
    return () => {
      scrollController.current && scrollController.current.destroy();
    };
  }, []);
  return (
    <div className={styles.home} ref={scrollEle}>
      <div className={styles.homeScroll}>
        <div className={styles.bannerWrapper}>
          <Carousel className={styles.banner} imgList={banners} />
        </div>
        <div className={styles.recommend}>
          <Title title='推荐歌单' to='/songList' />
          <div className={styles.recommendList}>
            {recommend.map((item: any) => (
              <SquareListItem
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
              <SquareListItem
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
