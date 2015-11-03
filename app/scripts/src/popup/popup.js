'use strict';

var React = require('react');
var App = require('./components/app.js');

var notWatchingMessages = [
  'You\'re not watching anything right now :/',
  'Dude, just watch something',
  'Plenty of things to watch on NRK'
];

var aboutMessages = [
  'Bringing your NRK history to Trakt.tv'
];

React.render(
  <App notWatchingMessages={notWatchingMessages} aboutMessages={aboutMessages} />,
  document.querySelector('.app-container')
);