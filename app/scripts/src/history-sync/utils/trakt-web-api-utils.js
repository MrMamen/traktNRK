import moment from 'moment';

import Settings from '../../settings';
import Request from '../../request';
import Search from '../../content/search';

import ActivityActionCreators from '../actions/activity-action-creators';

const URL = `${Settings.apiUri}/sync/history`;

export default class TraktWebAPIUtils {
  static activityUrl(activity) {
    if (activity.type === 'show') {
      return `${URL}/episodes/${activity.ids.trakt}`;
    } else {
      return `${URL}/movies/${activity.ids.trakt}`;
    }
  }

  static addActivities(activities) {
    Request.send({
      method: 'POST',
      url: URL,
      params: TraktWebAPIUtils.activitiesPayload(activities),
      success: function(response) {
        let json = JSON.parse(response);
        ActivityActionCreators.syncSuccess(json.added.episodes, json.added.movies);
        chrome.runtime.sendMessage({ type: 'sendEvent', name: 'HistorySync', value:  true });
      },
      error: function(status, response) {
        ActivityActionCreators.syncFailed(status, response);
        chrome.runtime.sendMessage({ type: 'sendEvent', name: 'HistorySync', value:  false });
      }
    });
  }

  static activitiesPayload(activities) {
    let activitiesToAdd = activities.filter((activity) => activity.add);
    let movies = activitiesToAdd
      .filter((activity) => activity.trakt && activity.trakt.type === 'movie')
      .map(TraktWebAPIUtils.activityPayload);
    let episodes = activitiesToAdd
      .filter((activity) => activity.trakt && activity.trakt.type === 'show')
      .map(TraktWebAPIUtils.activityPayload);

    return { movies: movies, episodes: episodes };
  }

  static activityPayload(activity) {
    return {
      'watched_at': activity.nrk.date,
      'ids': {
        'trakt': activity.trakt.ids.trakt
      }
    }
  }

  static getActivity(options) {
    return new Promise((resolve, reject) => {
      TraktWebAPIUtils.searchItem(options)
        .then((result) => {
          TraktWebAPIUtils.getActivityHistory(Object.assign(options, { result: result })).then(resolve).catch(reject);
        })
        .catch((status, response) => {
          let nrk = Object.assign(options.item, { date: options.date });
          resolve(Object.assign({ nrk }, { add: false }));
        });
    });
  }

  static getActivityHistory(options) {
    return new Promise((resolve, reject) => {
      Request.send({
        method: 'GET',
        url: TraktWebAPIUtils.activityUrl(options.result.activity),
        success: function(response) {
          let exclude = false;
          let allHistory = JSON.parse(response);
          let dates = [];

          allHistory.forEach((history) => {
            if (history && history.watched_at) {
              const date = moment(history.watched_at);
              exclude = exclude || date.diff(options.result.date, 'days') == 0;
              dates.push(date.clone());
            }
          });

          let trakt = Object.assign(options.result.activity, { dates: dates });
          let nrk = Object.assign(options.item, { date: options.date });
          exclude = exclude || (options.item.progress.percentageWatched < options.item.progress.percentageAssumedFinished);

          resolve(Object.assign({ nrk, trakt }, { add: !exclude }));
        },
        error: reject
      });
    });
  }

  static searchItem(options) {
    let search = new Search({ item: options.item });
    return new Promise((resolve, reject) => {
      search.find({
        success: function(response) {
          let activity = {
            type: options.item.type
          };

          if (options.item.type === 'movie') {
            activity = Object.assign(activity, response.movie);
          } else {
            activity = Object.assign(activity, response);
          }

          resolve({ activity: activity, date: options.date });
        },
        error: function(status, response) {
          reject(status, response);
        }
      });
    });
  }

  static getActivityFromURL(activity, url) {
    return new Promise((resolve, reject) => {
      if (!url) { reject(); }

      let pathname = url.replace('https://trakt.tv', '');

      Request.send({
        method: 'GET',
        url: `${Settings.apiUri}${pathname}`,
        success: function(response) {
          let result = JSON.parse(response);
          let type = activity.nrk.type;

          if (type === 'show') {
            let slug = pathname.split('/')[2];
            Request.send({
              method: 'GET',
              url: `${Settings.apiUri}/shows/${slug}`,
              success: function(res) {
                result.show = JSON.parse(res);
                TraktWebAPIUtils._parseActivityFromURL(activity, result, type)
                  .then(ActivityActionCreators.updateActivity)
                  .catch(reject);
              },
              error: reject
            });
          } else {
            TraktWebAPIUtils._parseActivityFromURL(activity, result, type)
              .then(ActivityActionCreators.updateActivity)
              .catch(reject);
          }
        },
        error: reject
      });
    });
  }

  static _parseActivityFromURL(activity, result, type) {
    let traktActivity = Object.assign(result, { type: type });
    return TraktWebAPIUtils.getActivityHistory(Object.assign({ item: activity.nrk }, { result: { activity: traktActivity } }, { date: activity.nrk.date }));
  }
}
