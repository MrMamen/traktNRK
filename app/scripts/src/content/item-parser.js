'use strict';

var Item = require('./item.js');

function ItemParser() {}

ItemParser.isReady = function checkPage() {
  var type = document.querySelector("meta[name=type]").getAttribute("content");
  if (type == "episode") {
    return document.querySelector("li.episode-item.active a") !== null;
  }
  return true;
};

ItemParser.parse = function parse(callback) {
  var item;
  var type = document.querySelector("meta[name=type]").getAttribute("content") == 'episode' ? 'show' : 'movie';
  var mainTitle = document.querySelector("meta[name=title]").getAttribute("content");

  if (type === 'show') {
    var uri = document.querySelector("li.episode-item.active a").getAttribute("href");
    if (uri.split("/")[4].substring(0, 6) !== "sesong") {
      return;
    }
    var season = uri.split("/")[4].slice(7);
    var number = uri.split("/")[5].slice(8);
    var title = uri.split("/")[2];

    item = new Item({
      epTitle: mainTitle,
      title: title,
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
