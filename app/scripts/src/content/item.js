'use strict';

/* A way to fix translation issues with NRK-titles and trakt-titles */
const tvdbIDs = {
  "narvestad-tar-ferie": 337638,
  "solgt": 278940,
  "broen": 252019,
  "kampen-om-tungtvannet": 289393,
  "laserblikk-paa-historien": 278057,
  "monster": 334378,
  "ukens-vinner": 306065,
  "side-om-side": 272955,
  "verdens-toeffeste-togturer": 264771,
  "paa-benken": 333947,
  "over-hekken": 299939,
  "hva-feiler-det-dege": 320101
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
