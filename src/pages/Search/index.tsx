import React, { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import request from '../../utils/request';
import { debounce } from 'lodash';

const Search = () => {
  const [hotSearch, setHotSearch] = useState([]);
  const [searchSuggest, setSearchSuggest] = useState([]);
  const inputEle = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    request('/search/hot').then(({ result }) => {
      const { hots } = result;
      setHotSearch(hots);
      if (hots.length && inputEle.current)
        inputEle.current.placeholder = hots[0].first;
    });
  }, []);
  const onClickTag = (value: string) => {
    if (inputEle.current) inputEle.current.placeholder = value;
  };
  const onInputFocus = async () => {
    if (inputEle.current) {
      const value = inputEle.current.value || inputEle.current.placeholder;
      const { result } = await request(
        `/search/suggest?keywords=%20${value}&type=mobile`
      );
      const { allMatch = [] } = result;
      console.log(allMatch);
    }
  };
  const onInput = debounce(() => {
    console.log(1);
  }, 1000);
  return (
    <div className={styles.searchWrapper}>
      <div className={styles.search}>
        <div className={styles.searchInput}>
          <i className='material-icons'>search</i>
          <input
            type='text'
            ref={inputEle}
            onInput={onInput}
            onFocus={onInputFocus}
          />
        </div>
        <button className={styles.submitBtn}>搜&nbsp;索</button>
      </div>
      <div className={styles.hotList}>
        {hotSearch.map((value: any, index) => (
          <span
            className={styles.tag}
            key={index}
            onClick={() => onClickTag(value.first)}
          >
            {value.first}
          </span>
        ))}
      </div>
    </div>
  );
};
export default Search;
