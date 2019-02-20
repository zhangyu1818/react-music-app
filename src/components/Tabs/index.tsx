import React, { PureComponent } from 'react';

class Tabs extends PureComponent {
  render() {
    return <div>{this.props.children}</div>;
  }
}

export default Tabs;
