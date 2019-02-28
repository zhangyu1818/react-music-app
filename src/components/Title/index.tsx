import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
interface TitleProps {
  title: string;
}
const Title = React.memo((props: TitleProps) => (
  <h1 className={styles.title}>
    {props.title}
    <i className={classNames('material-icons', styles.arrow)}>
      keyboard_arrow_right
    </i>
  </h1>
));
export default Title;
