'use strict';
const Rollbar = require('../rollbar.js');

const Item = require('./item.js');

function ItemParser() {}

ItemParser.isEpisodeOrMovie = function () {
  return document.querySelector("meta[property='og:type']") !== null;
};

ItemParser.isReady = function checkPage() {
  return document.querySelector("a.tv-series-episode-list-item--selected") !== null || document.querySelector("h1.tv-program-header__title") !== null;
};

ItemParser.parse = function parse(callback) {
  let item;
  let type;
  let mainTitle;
  const movieTitleElement = document.querySelector(".tv-program-header__title");
  const seriesTitleElement = document.querySelector(".tv-series-hero__title");
  if (movieTitleElement) {
    type = "movie";
    const movieTitle = movieTitleElement.textContent
    item = new Item({ title: movieTitle, type: type });
  } else if (seriesTitleElement) {
    type = "show";
    mainTitle = seriesTitleElement.textContent;
    const uri = document.querySelector("a.tv-series-episode-list-item--selected").getAttribute("href");
    if (!uri.split('/')[3] || uri.split('/')[3] !== 'sesong') {
      Rollbar.error("Unexpected URL-format", uri);
      return;
    }
    const nrkSeriesId = uri.split("/")[2];
    const season = uri.split("/")[4];
    const number = uri.split("/")[6];

    item = new Item({
      title: mainTitle,
      season: season,
      episode: number,
      type: type,
      nrkId: nrkSeriesId
    });
  } else {
    Rollbar.error("Unknown series/movie type", typeElement.getAttribute("content"));
  }
  callback.call(this, item);
};

ItemParser.start = function start(callback) {
  if (!ItemParser.isEpisodeOrMovie()){
    console.error("No meta-type found");
    callback.call(this, null);
    return;
  }
  let readyTimeout;

  if (ItemParser.isReady()) {
    ItemParser.parse(callback);
  } else {
    readyTimeout = setTimeout(function() {
      if (ItemParser.isReady()) {
        clearTimeout(readyTimeout);
        ItemParser.parse(callback);
      } else {
        ItemParser.start(callback);
      }
    }, 500);
  }
};

module.exports = ItemParser;
