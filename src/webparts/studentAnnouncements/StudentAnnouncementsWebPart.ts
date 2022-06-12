import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import StudentAnnouncements from './components/StudentAnnouncements';
import { default as pnp } from "sp-pnp-js";
import { IStudentAnnouncementsProps } from './components/IStudentAnnouncementsProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
export interface IStudentAnnouncementsWebPartProps {
  users: string;
  content: string;
  userDisplayName: string;
  userEmail: string;
}

export default class StudentAnnouncementsWebPart extends BaseClientSideWebPart<IStudentAnnouncementsWebPartProps> {

  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = '';
  constructor() {
    super();
    SPComponentLoader.loadCss(require('../studentAnnouncements/assets/fabric.css'));
  }
  protected onInit(): Promise<void> {
    return super.onInit().then(_ => {
      pnp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IStudentAnnouncementsProps> = React.createElement(
      StudentAnnouncements,
      {
        users: this.properties.users,
        content: this.properties.content,
        userDisplayName: this.context.pageContext.user.displayName,
        email: this.context.pageContext.user.email,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    if (!currentTheme) {
      return;
    }

    this._isDarkTheme = !!currentTheme.isInverted;
    const {
      semanticColors
    } = currentTheme;
    this.domElement.style.setProperty('--bodyText', semanticColors.bodyText);
    this.domElement.style.setProperty('--link', semanticColors.link);
    this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered);

  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Properties'
          },
          groups: [
            {
              groupName: 'List Titles',
              groupFields: [
                PropertyPaneTextField('users', {
                  label: 'Users Data List Title'
                }),
                PropertyPaneTextField('content', {
                  label: 'Personalised Content List Title'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
