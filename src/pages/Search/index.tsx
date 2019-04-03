import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";
import request from "../../utils/request";
import classNames from "classnames";
import { debounce } from "lodash";
import { useMyContext } from "../../context";
import { CHANGE_SEARCH_VALUE } from "../../reducer/actionType";

const Search = (props: any) => {
  const { dispatch } = useMyContext();
  const [hotSearch, setHotSearch] = useState([]);
  const [searchSuggest, setSearchSuggest] = useState([]);
  const [show, setSearchStatus] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputEle = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    request('/search/hot').then(({ result }) => {
      const { hots } = result;
      setHotSearch(hots);
      if (hots.length && inputEle.current)
        inputEle.current.placeholder = hots[0].first;
    });
    document.addEventListener("click", onBlur);
    return () => document.removeEventListener("click", onBlur);
  }, []);
  const onClickTag = (value: string) => {
    if (inputEle.current) inputEle.current.placeholder = value;
  };
  const onInputChange = debounce(async () => {
    if (!inputEle.current) return;
    const value = inputEle.current.value || inputEle.current.placeholder;
    const { result } = await request(
      `/search/suggest?keywords=%20${value}&type=mobile`
    );
    const { allMatch = [] } = result;
    setSearchSuggest(allMatch);
    setSearchStatus(true);
  }, 1000);
  const onBlur = ({ target }: MouseEvent) => {
    const wrapper = document.querySelector(`.${styles.searchInput}`);
    // @ts-ignore
    if (wrapper && !wrapper.contains(target)) setSearchStatus(false);
  };
  const onClickItem = (value: string) => {
    if (inputEle.current) inputEle.current.value = value;
  };
  const onCommit = async () => {
    if (!inputEle.current) return;
    const value = inputEle.current.value || inputEle.current.placeholder;
    dispatch({
      type: CHANGE_SEARCH_VALUE,
      searchValue: value
    });
    props.history.push("/search/result");
  };
  return (
    <div className={styles.searchWrapper}>
      <div className={styles.search}>
        <div className={styles.searchInput}>
          <i className='material-icons'>search</i>
          <input
            type='text'
            ref={inputEle}
            onFocus={onInputChange}
            onChange={onInputChange}
          />
          <div
            className={classNames(styles.suggest, show ? styles.active : null)}
            style={{ visibility: show ? "visible" : "hidden" }}
          >
            <ul>
              {searchSuggest.map((item: any) => (
                <li
                  key={item.keyword}
                  onClick={() => onClickItem(item.keyword)}
                >
                  {item.keyword}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <button className={styles.submitBtn} onClick={onCommit}>
          搜&nbsp;索
        </button>
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
