import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import axios from 'axios';
import SquareListItem from '../../components/SquareListItem';
import BScroll from 'better-scroll';
import PlayIcon from '../../components/PlayIcon';

const Loading = (props: { visible: boolean }) => (
  <div
    className={styles.loading}
    style={{ visibility: props.visible ? 'visible' : 'hidden' }}
  >
    <PlayIcon color='rgba(51, 51, 51, 0.6)' />
    <span>玩命加载中~</span>
  </div>
);
const NoMore = (props: { hasMore: boolean }) => (
  <div
    style={{ display: props.hasMore ? 'none' : 'block' }}
    className={styles.noMore}
  >
    没有更多内容了~
  </div>
);

let lastHasMore = false;

const SongList = (props: any) => {
  const [songList, setSongList] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollController = useRef<BScroll | null>(null);
  const before = useRef(0);
  useEffect(() => {
    fetchList().then(() => {
      scrollController.current = new BScroll(`.${styles.listWrapper}`, {
        click: true,
        pullUpLoad: true
      });
      scrollController.current.on('pullingUp', async () => {
        if (!lastHasMore) {
          scrollController.current && scrollController.current.finishPullUp();
          return;
        }
        await fetchList();
      });
    });
    return () => {
      scrollController.current!.destroy();
    };
  }, []);
  useEffect(() => {});
  const fetchList = async () => {
    setLoading(true);
    const { data, status } = await axios(
      `/top/playlist/highquality?limit=24${
        before.current ? `&before=${before.current}` : ''
      }`
    );
    if (status !== 200) throw new Error('数据获取失败');
    const { more, playlists } = data;
    lastHasMore = more;
    before.current = playlists.length
      ? playlists[playlists.length - 1].updateTime
      : before.current;
    setHasMore(more);
    setSongList((prevState) => [...prevState, ...(playlists as never[])]);
  };
  useEffect(() => {
    scrollController.current && scrollController.current.refresh();
    scrollController.current && scrollController.current.finishPullUp();
    setLoading(false);
  }, [songList.length]);
  return (
    <div className={styles.listWrapper}>
      <div className={styles.scroll}>
        <div className={styles.content}>
          <div className={styles.list}>
            {songList.map((item: any) => (
              <SquareListItem
                onClick={() => {
                  console.log(item);
                  props.history.push('/playList', item);
                }}
                key={item.id}
                playCount={item.playCount}
                picUrl={item.coverImgUrl}
                title={item.name}
              />
            ))}
          </div>
          <Loading visible={loading} />
          <NoMore hasMore={hasMore} />
        </div>
      </div>
    </div>
  );
};

export default SongList;
