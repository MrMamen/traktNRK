#Trakt.tv and NRK integration
This project was forked from a [similar plugin for Netflix and trakt.tv](https://github.com/tegon/traktflix)
[![download](ChromeWebStore_BadgeWBorder_v2_206x58.png)](https://chrome.google.com/webstore/detail/traktnrk-nrk-and-trakttv/pmdefhmfakfklmghckphgnfifbcmeahk)

###Table of Contents
* [What is Trakt?](#what-is-trakt)
* [Why do I need this extension?](#why-do-i-need-this-extension)
* [How this works?](#how-this-works)
* [Limitations](#limitations)
* [Problems](#problems)
* [Development](#development)

###What is Trakt?
Automatically scrobble TV show episodes and movies you are watching to Trakt.tv! Keep a history of everything you've watched! Sign up for a free account at [Trakt.tv](http://trakt.tv) and get a ton of features.

###Why do I need this extension?
Trakt.tv has a [lot of plugins](http://trakt.tv/downloads) to automatically scrobble the movies and episodes you watch from your media center.
But i found nothing to integrate with NRK, so i created this extension.
Every time you click to play something on NRK, it will send the scrobble to Trakt.tv. Cool, isn't it?

###How this works?
Unfortunately NRK doesn't provide a public API, so the movie or episodes info is extracted from the HTML of the web TV.

###Limitations
Obviously the plugin is only able to match and scrobble series and movies which is available on trakt.tv. See Trakt help page on how to [add TV shows](http://support.trakt.tv/knowledgebase/articles/151225-how-do-i-add-a-missing-tv-show) and [movies](http://support.trakt.tv/knowledgebase/articles/151226-how-do-i-add-a-missing-movie). 
Since most of the international titles on NRK web-TV has a Norwegian translation, it might not always match content. Some of these mismatches may be fixed in a future update.
Also some series use a different season numbering (usually years) than the ones on trakt.tv. This will probably never be supported.  

###Problems
If you find any problems or have suggestions or questions, feel free to [open an issue](https://github.com/mrmamen/traktflix/issues/new)

###Development
Create an application in [Trakt API](http://trakt.tv/oauth/applications/new).

Don't forget to check `/scrobble` permission.

In `Redirect uri:` put `https://{extensionId}.chromiumapp.org`

In `Javascript (cors) origins:` put `https://{extensionId}.chromiumapp.org` and `chrome-extension://{extensionId}`

Copy the `config.json` example file and change Trakt.tv credentials:
```bash
cp config.json.dev config.json
```

Use [nvm](https://github.com/creationix/nvm) to run in the correct version of node

```bash
nvm use
```

Install the dependencies
```bash
npm install
```

To run in development mode
```bash
npm start
```

To get build version (generates app.zip, ready for chrome store)
```bash
npm run build
npm run zip
```

To run tests
```bash
npm test
```

[LICENSE](LICENSE)