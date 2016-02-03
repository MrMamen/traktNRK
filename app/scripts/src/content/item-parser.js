'use strict';

var Item = require('./item.js');

function ItemParser() {}

ItemParser.isReady = function checkPage() {
  var player = document.getElementById("flashPlayer"); //Currently Chrome only supports the flashplayer
  return player !== null && player["JSgetDuration"] !== undefined;
};

ItemParser.parse = function parse(callback) {
  var item;
  var player = document.getElementById("flashPlayer");
  var progress = player["JSgetCurrentPosition"];
  var duration = player["JSgetDuration"];
  var type = document.querySelector("meta[name=type]").getAttribute("content") == 'episode' ? 'show' : 'movie';
  var mainTitle = document.querySelector("meta[name=title]").getAttribute("content");

  if (type === 'show') {
    var uri = document.querySelector("li.episode-item.active a").getAttribute("href");
    if (uri.split("/")[4].substring(0,6) !== "sesong"){
      return;
    }
    var season = uri.split("/")[4].slice(7);
    var number = document.querySelector("meta[name=episodenumber]").getAttribute("content");
    var title = document.querySelector("meta[name=seriestitle]").getAttribute("content");

    item = new Item({
      epTitle: title,
      title: mainTitle,
      season: season,
      episode: number,
      type: type
    });
  } else {
    item = new Item({ title: mainTitle, type: type });
  }

  callback.call(this, item);
};

ItemParser.start = function start(callback) {
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
