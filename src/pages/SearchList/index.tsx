import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import SimpleHeader from "../../components/SimpleHeader";
import { useMyContext } from "../../context";
import request from "../../utils/request";
import { fetchSong } from "../../utils/song";

interface ItemProps {
  name: string;
  singer: any[];
  onClick: () => void;
}

const Item = (props: ItemProps) => (
  <div className={styles.item} onClick={props.onClick}>
    <div className={styles.songName}>{props.name}</div>
    <div className={styles.singer}>
      {props.singer.map((singer) => singer.name).join("/")}
    </div>
  </div>
);

interface SearchListProps {
  [props: string]: any;
}

const SearchList = (props: SearchListProps) => {
  const { state, dispatch } = useMyContext();
  const [songList, setSongList] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const { result } = await request(`/search?keywords=${state.searchValue}`);
      return result;
    };
    if (!state.searchValue) return;
    fetchData().then(({ songs }) => {
      setSongList(songs);
    });
  }, [state.searchValue]);
  const onClickSong = async (id: number) => {
    const result = await fetchSong(id);
    console.log(result);
  };
  return (
    <div className={styles.searchList}>
      <SimpleHeader
        title={"搜索"}
        onClickBack={() => {
          props.history.goBack();
        }}
      />
      <div className={styles.list}>
        <ul className={styles.wrapper}>
          {songList.map((song: any) => (
            <Item
              key={song.id}
              onClick={() => onClickSong(song.id)}
              name={song.name}
              singer={song.artists}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchList;
