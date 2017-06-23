'use strict';

function WatchEvents(options) {
  this.document = document;
  this.onPlay = options.onPlay;
  this.onPause = options.onPause;
  this.onStop = options.onStop;
  this.url = location.href;
  this.wasPlaying = false;
}

WatchEvents.prototype = {
  startListeners: function() {
    this.addStopListener();
    this.addUrlChangeListener();
    this.addIsPlayingListener();
  },

  stopListeners: function() {
    this.removeStopListener();
    this.removeUrlChangeListener();
    this.removeIsPlayingListener();
  },

  addStopListener: function() {
    window.onbeforeunload = window.onunload = function() {
      this.onStop();
      this.stopListeners();
    }.bind(this)
  },

  addUrlChangeListener: function() {
    this.urlChangeInterval = setTimeout(function() {
      if (this.url !== location.href) {
        this.onUrlChange(this.url, location.href);
        this.url = location.href;
      }
      clearTimeout(this.urlChangeInterval);
      this.addUrlChangeListener();
    }.bind(this), 500);
  },

  addIsPlayingListener: function() {
    this.checkIsPlayingInterval = setInterval(function() {
      const isPlaying = this.isPlaying();
      if (this.wasPlaying != isPlaying){
        if (isPlaying){
          this.onPlay();
        }else{
          this.onPause();
        }
        this.wasPlaying = isPlaying;
      }
    }.bind(this), 1000);
  },

  onUrlChange: function(oldUrl, newUrl) {
    if (/serie/.test(oldUrl) && /serie/.test(newUrl)) {
      this.onStop();
      this.onPlay();
    } else if (/serie/.test(oldUrl) && !/serie/.test(newUrl)) {
      this.onStop();
    } else if (!/serie/.test(oldUrl) && /serie/.test(newUrl)) {
      this.onPlay();
    }
  },

  removeStopListener: function() {
    window.onpopstate = null;
    window.onbeforeunload = null;
  },

  removeUrlChangeListener: function() {
    clearInterval(this.urlChangeInterval);
  },

  removeIsPlayingListener: function() {
    clearInterval(this.checkIsPlayingInterval);
  },

  isPlaying: function() {
    const playIcon = document.getElementsByClassName("ludo-playicon")[0];
    if (playIcon) {
      return (/ludo-playicon--pause/.test(playIcon.className));
    };
    return false;
  }
};

module.exports = WatchEvents;
