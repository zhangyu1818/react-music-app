import React, { PureComponent } from 'react';
import styles from './tabPane.module.scss';
class TabPane extends PureComponent<any, any> {
  render() {
    return <div className={styles.tabPane}>{this.props.children}</div>;
  }
}

export default TabPane;
