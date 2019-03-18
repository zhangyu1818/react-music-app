import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import axios from 'axios';
import SquareListItem from '../../components/SquareListItem';
import BScroll from 'better-scroll';

const SongList = (props: any) => {
  const [songList, setSongList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollController = useRef<BScroll | null>(null);
  const before = useRef(0);
  useEffect(() => {
    fetchList();
    scrollController.current = new BScroll(`.${styles.listWrapper}`, {
      pullUpLoad: true
    });
    scrollController.current.on('pullingUp', () => {
      fetchList().then(res=>console.log(res));
    });
  }, []);
  const fetchList = async () => {
    const { data, status } = await axios(
      `/top/playlist/highquality?limit=24${
        before.current ? `&before=${before.current}` : ''
      }`
    );
    if (status !== 200) throw new Error('数据获取失败');
    const { more, playlists } = data;
    const updateTime = playlists.length
      ? playlists[playlists.length - 1].updateTime
      : before.current;
    before.current = updateTime;
    setHasMore(more);
    setSongList((prevState) => [...prevState, ...(playlists as never[])]);
  };
  useEffect(() => {
    console.log(1);
  });
  return (
    <div className={styles.listWrapper}>
      <div className={styles.scroll}>
        <div className={styles.list}>
          {songList.map((item: any) => (
            <SquareListItem
              onClick={() => {
                props.history.push('/playList', item);
              }}
              key={item.id}
              playCount={item.playCount}
              picUrl={item.coverImgUrl}
              title={item.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SongList;
