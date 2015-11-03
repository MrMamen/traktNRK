'use strict';

/* A way to fix translation issues with NRK-titles and trakt-titles */
var fullTitles = {
  'Broen': 'The Bridge'
}

function Item(options) {
  this.scrubber = options.scrubber;
  this.progress = options.progress;
  this.duration = options.duration;
  this.title = fullTitles[options.title] || options.title;
  this.type = options.type;

  if (this.type === 'show') {
    this.epTitle = options.epTitle;
    this.season = options.season;
    this.episode = options.episode;
  }
}

Item.prototype.getProgress = function() {
  if (this.scrobber !== undefined){
    return parseFloat(parseFloat(this.scrubber.style.width).toFixed(2));
  }
  return parseFloat(parseFloat(this.progress()/this.duration()*100).toFixed(2));
};

module.exports = Item;