import moment from 'moment';

import Request from '../../request';
import Item from '../../content/item';

import TraktWebAPIUtils from './trakt-web-api-utils';
import ActivityActionCreators from '../actions/activity-action-creators';

const AUTH_REGEXP = new RegExp("\"authURL\":\"(.*?)\"");
const BUILD_IDENTIFIER_REGEXP = new RegExp("\"BUILD_IDENTIFIER\":\"(.*?)\"");
const VIEWING_ACTIVIY_IDENTIFIER_REGEXP = new RegExp("viewingactivity\":\"(.*?)\"");
const NRK_HOST = 'https://tv.nrk.no';
const NRK_API_HOST = `${NRK_HOST}/history`;

export default class NRKWebAPIUtils {
  static extractAuthURL(response) {
    return AUTH_REGEXP.exec(response)[1];
  }

  static extractBuildIndentifier(response) {
    return BUILD_IDENTIFIER_REGEXP.exec(response)[1];
  }

  static extractViewingActivityIdentifier(response) {
    return VIEWING_ACTIVIY_IDENTIFIER_REGEXP.exec(response)[1];
  }

  static listActivities() {
    Request.send({
      method: 'GET',
      url: `${NRK_API_HOST}`,
      success: (response) => {
        const list = JSON.parse(response);
        const parsedActivities = list.map(NRKWebAPIUtils.parseActivity);

        Promise.all(parsedActivities)
          .then(ActivityActionCreators.receiveActivities)
          .catch(ActivityActionCreators.receiveActivitiesFailed);
      },
      error: (response, status) => {
        console.log(response, status);
      }
    });
  }

  static getActivities() {
   NRKWebAPIUtils.listActivities();
  }

  static parseActivity(activity) {
    const program = activity.program;
    const date = moment(activity.lastSeen.at).add(2, "h"); //NRK timestamp is in GMT
    let item;
    const type = program.programType === 'Episode' ? 'show' : 'movie';

    if (type === 'show') {
      const title = program.seriesTitle;
      let season = program.seasonNumber;

      if (season) {
        season = parseInt(season);
      }

      let episode = program.episodeNumber;
      if (episode){
        episode = parseInt(episode);
      }

      item = new Item({
        episode: episode,
        title: title,
        season: season,
        type: type
      });
    } else {
      item = new Item({ title: program.title, type: type });
    }

    return new Promise((resolve, reject) => {
      Object.assign(item, { id: program.id, progress: activity.lastSeen });
      TraktWebAPIUtils.getActivity({ item, date }).then(resolve).catch(reject);
    });
  }
}
