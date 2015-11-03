'use strict';

/* This was necessary to priorize Star Wars: The Clone Wars (2008) over Star Wars: Clone Wars (2003).
  I left this object because it could be useful for other movies/shows */
var fullTitles = {
  'Star Wars: The Clone Wars': '"Star Wars: The Clone Wars"',
  'The Office (U.S.)': 'The Office (US)'
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