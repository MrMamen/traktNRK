'use strict';

var Request = require('../request.js');
var Settings = require('../settings.js');

function Scrobble(options) {
  if (options.type === 'show') {
    this.item = { episode: options.response };
  } else {
    this.item = { movie: options.response.movie };
  }

  this.onProgressChange();
  this.url = Settings.apiUri + '/scrobble';
  this.success = options.success;
  this.error = options.error;
  this.startProgressTimeout();
};

Scrobble.prototype = {
  startProgressTimeout: function() {
    this.progressChangeInterval = setInterval(function() {
      this.onProgressChange();
    }.bind(this), 1000);
  },

  stopProgressTimeout: function() {
    clearInterval(this.progressChangeInterval);
  },

  onProgressChange: function() {
    this.html5Scrubber();
  },

  html5Scrubber: function() {
    var scrubber = document.getElementsByClassName("ludo-scrubber__played")[0];
    if (scrubber){
      this.progress = parseFloat(scrubber.style.width);
    }
  },

  _sendScrobble: function(options) {
    var params = this.item;
    params.progress = this.progress;

    Request.send({
      method: 'POST',
      url: this.url + options.path,
      params: params,
      success: this.success,
      error: this.error
    });
  },

  start: function() {
    this._sendScrobble({ path: '/start' });
  },

  pause: function() {
    this._sendScrobble({ path: '/pause' });
  },

  stop: function() {
    this._sendScrobble({ path: '/stop' });
    this.stopProgressTimeout();
  }
};

module.exports = Scrobble;
