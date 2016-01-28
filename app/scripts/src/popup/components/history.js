'use strict';

var React = require('react');
var Loading = require('./loading.js');
var ChromeStorage = require('../../chrome-storage.js');

module.exports = React.createClass({
  componentDidMount: function() {
    this.props.componentHandler.upgradeDom();
  },
  onAutoSyncChanged: function(e) {
    ChromeStorage.set({ 'auto_sync': e.target.checked }, function() {});
    this.props.onAutoSyncChanged(e);
  },
  render: function() {
    chrome.runtime.sendMessage({ type: 'sendAppView', view: 'History' });

    return(
      <div className='mdl-card mdl-shadow--2dp info-card history-card'>
        <Loading show={this.props.loading} />

        <div className='mdl-card__title mdl-card--expand'>
          <h5>Sync your viewing activity from other devices</h5>
        </div>

        <div className='mdl-card__supporting-text'>
          In a future version it may be possible to sync the NRK history with trakt history.
        </div>
        {/*
        <label htmlFor='autoSync' className='mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect'>
          <input onChange={this.onAutoSyncChanged} type='checkbox' id='autoSync' className='mdl-checkbox__input' checked={this.props.autoSync} />
          <span className='mdl-checkbox__label'>Automatically sync in background</span>
        </label>

        <button onClick={this.props.onSyncNowClicked} className='mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect'>
          Sync Now
        </button>
        */}
      </div>
    );
  }
});