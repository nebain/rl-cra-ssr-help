import React from 'react';
import Page from '../../components/page';

import moment from 'moment-timezone';

export default () => {
  const m = moment('2018-10-01 00:00:00').format('Y M d');
  return (
    <Page>
      <p>What we're all about. Static date: {m}</p>
    </Page>
  );
};
