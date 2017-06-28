import ViewingActivityAppDispatcher from '../dispatcher/viewing-activity-app-dispatcher';
import ActionTypes from '../constants/activity-constants';
import NRKWebAPIUtils from '../utils/nrk-web-api-utils';

export default class ActivityActionCreators {
  static receiveActivities(activities) {
    ViewingActivityAppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_ACTIVITIES,
      activities: activities.filter((activity) => !!activity)
    });
  }

  static receiveActivitiesFailed(status, response) {
    ViewingActivityAppDispatcher.dispatch({
      type: ActionTypes.RECEIVE_ACTIVITIES_FAILED,
      status: status,
      response: response
    });
  }

  static toggleActivity(activity, value) {
    ViewingActivityAppDispatcher.dispatch({
      type: ActionTypes.TOGGLE_ACTIVITY,
      activity: activity,
      value: value
    });
  }

  static updateActivity(activity) {
    ViewingActivityAppDispatcher.dispatch({
      type: ActionTypes.UPDATE_ACTIVITY,
      activity: activity
    });
  }

  static syncSuccess(episodesCount, moviesCount) {
    ViewingActivityAppDispatcher.dispatch({
      type: ActionTypes.SYNC_SUCCESS,
      episodesCount: episodesCount,
      moviesCount: moviesCount
    });
  }

  static syncFailed(status, response) {
    ViewingActivityAppDispatcher.dispatch({
      type: ActionTypes.SYNC_FAILED,
      status: status,
      response: response
    });
  }
}
