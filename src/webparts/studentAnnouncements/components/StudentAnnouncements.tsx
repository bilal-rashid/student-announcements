import * as React from 'react';
import styles from './StudentAnnouncements.module.scss';
import { IStudentAnnouncementsProps } from './IStudentAnnouncementsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { default as pnp } from "sp-pnp-js";
import { Icon } from '@fluentui/react/lib/Icon';
import { Stack, IStackStyles, IStackTokens } from '@fluentui/react/lib/Stack';
import { mergeStyles, DefaultPalette } from '@fluentui/react/lib/Styling';
import {  IStackItemStyles } from '@fluentui/react/lib/Stack';

const stackStyles: IStackStyles = {
    root: {
        background: 'white'
    },
};
const stackItemStyles: IStackItemStyles = {
    root: {
        alignItems: 'center',
        background: DefaultPalette.white,
        color: DefaultPalette.black,
        display: 'flex',
        justifyContent: 'center',
        paddingLeft: 5,
    },
};
const stackItemStyles2: IStackItemStyles = {
    root: {
        marginTop: 20,
        paddingLeft: 5,
        paddingRight: 5,
    },
};

// Tokens definition
const outerStackTokens: IStackTokens = { childrenGap: 5 };
const innerStackTokens: IStackTokens = {
    childrenGap: 2,
    padding: 5,
};

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
                  <h2 style={{color: '#354969'}}>Welcome, {escape(userDisplayName)}!</h2>
                  <div className={styles.welcome}>
                      <div className="ms-Grid" dir="ltr">

                          <div className="ms-Grid-row">
                              {
                                  this.state?.filteredList?.map(item =>
                                  <div className={styles.box}>
                                      <Stack tokens={outerStackTokens}>
                                          <Stack styles={stackStyles} tokens={innerStackTokens}>
                                              <Stack.Item styles={stackItemStyles}>
                                                  <div style={{width: '100%'}} className="ms-Grid" dir="ltr">
                                                      <div className="ms-Grid-row">
                                                          <div className={styles.title}> {item.Title}</div>
                                                         <a target={'_blank'} href={item.ContentUrl.Url}><div className="ms-Grid-col ms-lg2"><Icon className={styles.icon} iconName="SkypeCircleArrow" /></div></a>
                                                      </div>
                                                  </div>
                                              </Stack.Item>
                                              <Stack.Item styles={stackItemStyles2}>
                                                  <p style={{textAlign: 'left'}}> {item.PersonalisedContent} </p>
                                              </Stack.Item>
                                          </Stack>
                                      </Stack>
                                  </div>)
                              }
                          </div>
                      </div>
                  </div>
              </>
              : null}
      </section>
    );
  }
}
