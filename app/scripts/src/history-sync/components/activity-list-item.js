import React from 'react';

import ActivityActionCreators from '../actions/activity-action-creators';
import TraktURLForm from './trakt-url-form';
import TraktWebAPIUtils from '../utils/trakt-web-api-utils';
import TmdbImage from '../../tmdb-image';

export default class ActivityListItem extends React.Component {
  constructor() {
    super();
    this.state = { showTraktURLForm: false };
  }

  componentDidMount() {
    this.props.componentHandler.upgradeDom();
  }

  _onChange(event) {
    ActivityActionCreators.toggleActivity(this.props.activity, event.target.checked);
  }

  _onShowTraktURLForm(event) {
    this.setState({ showTraktURLForm: true });
  }

  _onSubmitTraktURL(activity, url) {
    TraktWebAPIUtils.getActivityFromURL(activity, url);
  }

  render() {
    let activity = this.props.activity;
    let nrk = activity.nrk;
    let nrkTitle = nrk.epTitle ? `${nrk.title}: ${nrk.epTitle}` : nrk.title;
    if (nrk.type === "show") {
      nrkTitle += " (S"+nrk.season+"E"+nrk.episode+")";
    }
    let nrkUrl = `https://tv.nrk.no/program/${nrk.id}`;
    let trakt = activity.trakt;
    let traktDate, traktUrl, traktTitle;

    if (trakt) {
      traktDate = trakt.date ? trakt.date.format('MMMM Do YYYY, HH:mm:ss') : '-';
      traktUrl = trakt.season ? `https://trakt.tv/shows/${trakt.show.ids.slug}/seasons/${trakt.season}/episodes/${trakt.number}` : `https://trakt.tv/movies/${trakt.ids.slug}`;
      if (trakt.show && trakt.title){
        traktTitle = `${trakt.show.title}: ${trakt.title}`;
      } else {
        traktTitle = trakt.show ? trakt.show.title : trakt.title;
      }
    }

    let formId = `${nrk.id}--add`;

    return(
      <li className='mdl-list__item mdl-list__item--three-line'>
        <span className='mdl-list__item-primary-content'>
          <TmdbImage
            className='mdl-list__item-avatar'
            item={trakt}
            imageHost={this.props.imageHost}
            imageWidth={this.props.imageWidth}
          />
          <span><a href={nrkUrl} target='_blank'>NRK title: {nrkTitle}</a></span>
          <span> / </span>
          <span><a href={traktUrl} target='_blank'>Trakt.tv title: {traktTitle}</a></span>
          <span className='mdl-list__item-text-body'>
            NRK date: {nrk.date.format('MMMM Do YYYY, HH:mm:ss')} / Trakt.tv date: {traktDate}
            <br />
            NRK progress: {nrk.progress.percentageWatched}%
            <br />
            Is this wrong or incomplete? <a className='paste-trakt-url' onClick={this._onShowTraktURLForm.bind(this)}>Paste Trakt.tv URL</a>
            <TraktURLForm activity={activity} show={this.state.showTraktURLForm} onSubmit={this._onSubmitTraktURL} />
          </span>
        </span>
        <span className='mdl-list__item-secondary-action'>
          <label className='mdl-switch mdl-js-switch mdl-js-ripple-effect' htmlFor={formId}>
            <input type='checkbox' id={formId} className='mdl-switch__input activity-item-switch' checked={activity.add} onChange={this._onChange.bind(this)} />
          </label>
        </span>
      </li>
    );
  }
}
