import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './index.module.scss';

const HomeHeader = () => {
  return (
    <header className={styles.homeHeader}>
      <h1 className={styles.title}>MUSIC</h1>
      <nav>
        <NavLink to={'/'} exact activeClassName={styles.active}>推荐</NavLink>
        <NavLink to={'/search'} exact activeClassName={styles.active}>搜索</NavLink>
      </nav>
    </header>
  );
};

export default HomeHeader;
