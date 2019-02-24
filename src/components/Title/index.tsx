import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
interface TitleProps {
  title: string;
}
const Title = React.memo((props: TitleProps) => (
  <h1 className={styles.title}>
    {props.title}
    <i className={classNames('iconfont', styles.arrow)}> &#xe683;</i>
  </h1>
));
export default Title;
