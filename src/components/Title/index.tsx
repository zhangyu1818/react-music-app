import React from 'react';
import classNames from 'classnames';
import styles from './index.module.scss';
import { Link } from 'react-router-dom';
interface TitleProps {
  title: string;
  to?: string | object;
}
const Title = React.memo((props: TitleProps) => (
  <Link to={props.to || ''}>
    <h1 className={styles.title}>
      {props.title}
      {props.to ? (
        <i className={classNames('material-icons', styles.arrow)}>
          keyboard_arrow_right
        </i>
      ) : null}
    </h1>
  </Link>
));
export default Title;
