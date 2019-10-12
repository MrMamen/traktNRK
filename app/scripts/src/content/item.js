'use strict';

/* A way to fix translation issues with NRK-titles and trakt-titles */
const tvdbIDs = {
  "narvestad-tar-ferie": 337638,
  "broen": 252019,
  "laserblikk-paa-historien": 278057,
  "monster": 334378,
  "kalde-foetter": 77152,
  "le-bureau": 294564,
  "hotellenes-hemmeligheter": 264122,
  "ei-tidsreise-gjennom-science-fiction-si-historie": 279432,
  "lykkeland": 344464,
  "romarriket": 343856,
  "exit": 361816
};

function Item(options) {
  this.title = options.title;
  this.type = options.type;
  this.tvdbId = tvdbIDs[options.nrkId];

  if (this.type === 'show') {
    this.epTitle = options.epTitle;
    this.season = options.season;
    this.episode = options.episode;
  }
}

module.exports = Item;
