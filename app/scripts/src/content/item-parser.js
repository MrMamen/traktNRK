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
  var mainTitle;
  var typeElement = document.querySelector("meta[name=type]");
  if (typeElement) {
    switch(typeElement.getAttribute("content")) {
      //Old format
      case 'program':
        type = "movie";
        mainTitle = document.querySelector("meta[name=title]").getAttribute("content");
        item = new Item({ title: mainTitle, type: type });
        break;
      case 'episode':
        type = "show";
        mainTitle = document.querySelector("meta[name=title]").getAttribute("content");
        Rollbar.info("Seems to not be a season based series", mainTitle);
        return;
      default:
        Rollbar.error("Unknown series/movie type", typeElement.getAttribute("content"));
        return;
    }
  } else {
    //new format as of july 2018 "/serie/narvestad-tar-ferie/sesong/1/episode/6"
    type = "show";
    mainTitle = document.querySelector(".tv-series-hero__title").textContent;
    var uri = document.querySelector("a.tv-series-episodes__episode-link--active").getAttribute("href");
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
