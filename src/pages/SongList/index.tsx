import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import SquareListItem from '../../components/SquareListItem';
import BScroll from 'better-scroll';
import PlayIcon from '../../components/PlayIcon';
import request from '../../utils/request';
import Categories from '../Categories';
import { Route } from 'react-router';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import SimpleHeader from '../../components/SimpleHeader';

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
  const [songList, setSongList] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [stateCat, setStateCat] = useState('全部歌单');
  const scrollController = useRef<BScroll | null>(null);
  const offset = useRef(0);
  const cat = useRef(stateCat);
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
  useEffect(
    () => {
      scrollController.current && scrollController.current.refresh();
      scrollController.current && scrollController.current.finishPullUp();
      setLoading(false);
    },
    [songList.length]
  );
  const fetchList = async () => {
    setLoading(true);
    const { more, playlists } = await request(
      `/top/playlist?limit=24${
        offset.current ? `&offset=${offset.current}` : ''
      }${cat.current ? `&cat=${cat.current}` : ''}`
    );
    lastHasMore = more;
    offset.current += 24;
    setHasMore(more);
    setSongList((prevState) => [...prevState, ...playlists]);
  };
  const onTagChange = (tag: string) => {
    if (tag === cat.current) return;
    setStateCat(tag);
    cat.current = tag;
    offset.current = 0;
    setHasMore(true);
    setSongList([]);
    scrollController.current!.scrollTo(0, 0, 0);
    fetchList();
  };
  return (
    <div className={styles.SongList}>
      <SimpleHeader
        title='推荐歌单'
        onClickBack={() => props.history.goBack()}
      />
      <Link to='/songList/categories' style={{ height: 0, display: 'block' }}>
        <h1 className={styles.title}>
          {stateCat}
          <i className={classNames('material-icons', styles.arrow)}>
            keyboard_arrow_right
          </i>
        </h1>
      </Link>
      <Route
        path='/songList/categories'
        render={(props) => (
          <Categories {...props} onChange={onTagChange} cat={cat.current} />
        )}
      />
      <div className={styles.listWrapper}>
        <div className={styles.scroll}>
          <div className={styles.content}>
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
            <Loading visible={loading} />
            <NoMore hasMore={hasMore} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongList;
