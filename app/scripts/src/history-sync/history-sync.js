import React from 'react';
import rollbar from '../rollbar';

import ViewingActivityApp from './components/viewing-activity-app';
import NRKWebAPIUtils from './utils/nrk-web-api-utils';

NRKWebAPIUtils.getActivities();

React.render(<ViewingActivityApp />, document.getElementById('viewing-activity-app'));
