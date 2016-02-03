'use strict';

/* A way to fix translation issues with NRK-titles and trakt-titles */
var fullTitles = {
  'Broen': 'The Bridge',
  'Kampen om tungtvannet': 'the heavy water wars',
  'Tyskland 83': 'Deutschland 83',
  'Laserblikk p\u00E5 historien': 'Time Scanners',
  "Krig og fred": 'War and Peace Alexander I',
  "Brodies mysterier": 'Case Histories'
}

function Item(options) {
  this.title = fullTitles[options.title] || options.title;
  this.type = options.type;

  if (this.type === 'show') {
    this.epTitle = options.epTitle;
    this.season = options.season;
    this.episode = options.episode;
  }
}

module.exports = Item;
