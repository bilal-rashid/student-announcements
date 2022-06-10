import * as React from 'react';
import styles from './StudentAnnouncements.module.scss';
import { IStudentAnnouncementsProps } from './IStudentAnnouncementsProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class StudentAnnouncements extends React.Component<IStudentAnnouncementsProps, {}> {
  public render(): React.ReactElement<IStudentAnnouncementsProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.studentAnnouncements} ${hasTeamsContext ? styles.teams : ''}`}>
        <h2 style={{color: '#394c6b'}}>Welcome, {escape(userDisplayName)}!</h2>
        <div className={styles.welcome}>
          <img alt="" src={isDarkTheme ? require('../assets/Screenshot2.png') : require('../assets/Screenshot2.png')} className={styles.welcomeImage} />
          {/*<div>{environmentMessage}</div>*/}
          {/*<div>Web part property value: <strong>{escape(description)}</strong></div>*/}
        </div>
      </section>
    );
  }
}
