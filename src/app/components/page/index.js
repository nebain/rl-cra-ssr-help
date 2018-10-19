import React, { Component } from 'react';
import { withRouter } from 'react-router';

class Page extends Component {
  render() {
    const { children } = this.props;

    return (
      <div>
        {children}
      </div>
    );
  }
}

export default withRouter(Page);
