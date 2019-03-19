import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';

const SimpleHeader = (props: { title: string; onClickBack: () => void }) => (
  <header className={styles.header}>
    <i
      className={classNames('material-icons', styles.headerBackIcon)}
      onClick={props.onClickBack}
    >
      arrow_back
    </i>
    <p className={styles.headerName}>{props.title}</p>
  </header>
);
export default SimpleHeader;
