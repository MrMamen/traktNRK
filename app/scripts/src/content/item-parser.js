'use strict';
var Rollbar = require('../rollbar.js');

var Item = require('./item.js');

function ItemParser() {}

ItemParser.isEpisodeOrMovie = function () {
  return document.querySelector("meta[property='og:type']") !== null;
};

ItemParser.isReady = function checkPage() {
  var type = document.querySelector("meta[name=type]");
  if (!type) {
    return document.querySelector("a.tv-series-episodes__episode-link--active") !== null;
  }
  return true;
};

ItemParser.parse = function parse(callback) {
  var item;
  var type;
  var typeElement = document.querySelector("meta[name=type]");
  if (typeElement) {
    if (typeElement.getAttribute("content") == 'program') {
      type = "movie";
    } else {
      Rollbar.error("Unknown series/movie type", typeElement.getAttribute("content"))
    }
  } else {
    type = "show"
  }
  var mainTitle = document.querySelector("title").text;
  if (mainTitle.slice(0, 7) !== "NRK TV ") {
    Rollbar.error("Title attribute changed", mainTitle)
  } else {
    mainTitle = mainTitle.slice(9);
  }
  if (type === 'show') {
    var uri = document.querySelector("a.tv-series-episodes__episode-link--active").getAttribute("href");
    //format as of july 2018 "/serie/narvestad-tar-ferie/sesong/1/episode/6"
    if (!uri.split('/')[3] || uri.split('/')[3] !== 'sesong') {
      Rollbar.error("Unexpected URL-format", uri);
      return;
    }
    var nrkSeriesId = uri.split("/")[2];
    var season = uri.split("/")[4];
    var number = uri.split("/")[6];
    // var epTitle = document.querySelector('a[itemprop="name"]').innerHTML;

    item = new Item({
      title: mainTitle,
      season: season,
      episode: number,
      type: type,
      nrkId: nrkSeriesId
    });
  } else {
    item = new Item({ title: mainTitle, type: type });
  }
  callback.call(this, item);
};

ItemParser.start = function start(callback) {
  if (!ItemParser.isEpisodeOrMovie()){
    console.error("No meta-type found");
    callback.call(this, null);
    return;
  }
  var readyTimeout;

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
