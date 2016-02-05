'use strict';

var KEY_SPACE = 32;
var KEY_ENTER = 13;
var KEY_LEFT_ARROW = 37;
var KEY_RIGHT_ARROW = 39;

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
    this.addClickListener();
    this.addStopListener();
    this.addKeyUpListener();
    this.addUrlChangeListener();
    this.addIsPlayingListener();
  },

  stopListeners: function() {
    this.removeClickListener();
    this.removeStopListener();
    this.removeKeyUpListener();
    this.removeUrlChangeListener();
    this.removeIsPlayingListener();
  },

  addClickListener: function() {
    this.document.addEventListener('click', this.onClick.bind(this), false);
  },

  addStopListener: function() {
    //window.onpopstate = this.onStop;
    window.onbeforeunload = function() {
      this.onStop();
      this.stopListeners();
    }.bind(this)
  },

  addKeyUpListener: function() {
    this.document.addEventListener('keyup', this.onKeyUp.bind(this), false);
  },

  addUrlChangeListener: function() {
    this.urlChangeInterval = setInterval(function() {
      if (this.url !== location.href) {
        this.onUrlChange(this.url, location.href);
        this.url = location.href;
      }
    }.bind(this), 1000);
  },

  addIsPlayingListener: function() {
    this.checkIsPlayingInterval = setInterval(function() {
      var isPlaying = this.isPlaying();
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

  onClick: function(e) {
    if (e.target.classList.contains('play')) {
      //Unfortinately the click event is not detected when pressing the player (due to flash)
      this.isPlaying() ? this.onPlay(e) : this.onPause(e);
    } else if (e.target.classList.contains('indexpoint-link')) {
      this.onStop(e);
      var self = this;
      setTimeout(function() {
        self.onPlay(e);
      }, 2000);
    }
  },

  onUrlChange: function(oldUrl, newUrl) {
    if (/watch/.test(oldUrl) && /watch/.test(newUrl)) {
      this.onStop();
      this.onPlay();
    } else if (/watch/.test(oldUrl) && !/watch/.test(newUrl)) {
      this.onStop();
    } else if (!/watch/.test(oldUrl) && /watch/.test(newUrl)) {
      this.onPlay();
    }
  },

  onKeyUp: function(e) {
    switch (e.which) {
      /* If the video is playing, the obvious would be call onPause,
        if isn't playing, call onPlay.
        But the HTML of the player gets updated before this function is called,
        this way the correct approach is invert the conditions */
      case KEY_SPACE:
      case KEY_LEFT_ARROW:
      case KEY_RIGHT_ARROW:
        this.isPlaying() ? this.onPlay(e) : this.onPause(e);
        break;
    }
  },

  removeClickListener: function() {
    this.document.removeEventListener('click', this.onClick.bind(this), false);
  },

  removeStopListener: function() {
    window.onpopstate = null;
    window.onbeforeunload = null;
  },

  removeKeyUpListener: function() {
    this.document.removeEventListener('keyup', this.onKeyUp.bind(this), false);
  },

  removeUrlChangeListener: function() {
    clearInterval(this.urlChangeInterval);
  },

  removeIsPlayingListener: function() {
    clearInterval(this.checkIsPlayingInterval);
  },

  isPlaying: function() {
    var player = document.getElementById("flashPlayer");
    if (player === null || player["JSgetCurrentPosition"] == undefined) {
      return false;
    }
    var dur = player["JSgetCurrentPosition"]();
    for (var i = 0; i < 150 && dur == player["JSgetCurrentPosition"](); i++) {
      //Just to pass some time to see if there is any progress
    }
    return dur !== player["JSgetCurrentPosition"]()
  }
};

module.exports = WatchEvents;
