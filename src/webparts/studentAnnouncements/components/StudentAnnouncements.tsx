import * as React from 'react';
import styles from './StudentAnnouncements.module.scss';
import { IStudentAnnouncementsProps } from './IStudentAnnouncementsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { default as pnp } from "sp-pnp-js";
export interface IStudentAnnouncementsState {
    isUserValid: boolean;
    studentMetadata: any;
    filteredList: any[];
}
export default class StudentAnnouncements extends React.Component<IStudentAnnouncementsProps, IStudentAnnouncementsState> {
    public componentDidMount() {
        this.setState({isUserValid: false, studentMetadata: {}});
        this.fetchUserInfo();
    }

    public fetchUserInfo = () => {
        pnp.sp.web.lists.getByTitle(this.props.users).getItemsByCAMLQuery({
            ViewXml: `<View><Query><Where><Eq><FieldRef Name="email"/><Value Type="Text">${this.props.email}</Value></Eq></Where></Query></View>`
        }).then(resultItems => {
            console.log('resultItems', resultItems);
            if (resultItems.length > 0) {
                this.setState({isUserValid: true, studentMetadata: resultItems[0]});
                this.getStudentAnnouncements();
            } else {
                this.setState({isUserValid: false, studentMetadata: {}});
            }
        });
    }
    public getStudentAnnouncements = () => {
        pnp.sp.web.lists.getByTitle(this.props.content).getItemsByCAMLQuery({
            ViewXml: `<View><Query><Where><Geq><FieldRef Name='UnpublishedDate' /><Value Type='DateTime'><Today/></Value></Geq></Where></Query></View>`
        }).then(results => {
            console.log('results content', results);
            const filtered = results.filter(p => p.Campus === this.state.studentMetadata.Campus ||
            p.Faculty === this.state.studentMetadata.Faculty || p.StudyLevel === this.state.studentMetadata.StudyLevel);
            let temp = {};
            if (this.state.studentMetadata.FinalYearOfStudy) {
                const res = results.filter(p => p.FinalYearOfStudy === true);
                if (res && res.length) {
                    res.forEach(item => {
                        temp[item.Id] = item;
                    });
                }
            }
            if (this.state.studentMetadata.FirstYearOfStudy) {
                const res = results.filter(p => p.FirstYearOfStudy === true);
                if (res && res.length) {
                    res.forEach(item => {
                        temp[item.Id] = item;
                    });
                }
            }
            if (this.state.studentMetadata.International) {
                const res = results.filter(p => p.International === true);
                if (res && res.length) {
                    res.forEach(item => {
                        temp[item.Id] = item;
                    });
                }
            }
            if (this.state.studentMetadata.WelcomeJan) {
                const res = results.filter(p => p.WelcomeJan === true);
                if (res && res.length) {
                    res.forEach(item => {
                        temp[item.Id] = item;
                    });
                }
            }
            if (this.state.studentMetadata.WelcomeSep) {
                const res = results.filter(p => p.WelcomeSep === true);
                if (res && res.length) {
                    res.forEach(item => {
                        temp[item.Id] = item;
                    });
                }
            }
            console.log(temp);
            let tempArray = [];
            Object.keys(temp).forEach(key => {
                tempArray.push(temp[key]);
            });
            this.setState({filteredList: tempArray});
        });
    }

    public render(): React.ReactElement<IStudentAnnouncementsProps> {
    const {
      users,
      content,
      userDisplayName
    } = this.props;
    console.log(this.state);
    return (
      <section className={`${styles.studentAnnouncements}`}>
          {this.state?.isUserValid ?
              <>
                  <h2 style={{color: '#394c6b'}}>Welcome, {escape(userDisplayName)}!</h2>
                  <div className={styles.welcome}>
                      {/*<div>{environmentMessage}</div>*/}
                      {/*<div>Web part property value: <strong>{escape(description)}</strong></div>*/}
                  </div>
              </>
              : null}
      </section>
    );
  }
}
