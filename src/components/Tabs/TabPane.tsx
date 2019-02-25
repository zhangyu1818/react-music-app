import React, { PureComponent } from 'react';
import styles from './tabPane.module.scss';
class TabPane extends PureComponent {
  render() {
    return <div className={styles.tabPane}>{this.props.children}</div>;
  }
}

export default TabPane;
