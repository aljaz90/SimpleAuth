import React, { Component } from 'react';
import EzAnime from '../components/Animations/EzAnime';
import { Alert } from '../components/Notifications/Alert';
import { Toast } from '../components/Notifications/Toast';

// Notification examples
/*
{
  type: "alert",
  contentType: "error",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a sem vitae sem iaculis porta. ",
  actions: [{text: "Okay", onClick: () => this.dismissNotification()}]
}
{
  type: "toast",
  contentType: "error",
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque a sem vitae sem iaculis porta. ",
  time: 3
}
*/

export default class NotificationSystem extends Component {
    render() {
        let component = null;
        if (this.props.notification) {
            if (this.props.notification.type === "toast") {
                component =  <Toast onDismiss={this.props.dismissNotification} {...this.props.notification} type={this.props.notification.contentType}>
                                {this.props.notification.text}
                            </Toast>;
            }
            else if (this.props.notification.type === "alert") {
                component =  <Alert {...this.props.notification} onDismiss={this.props.dismissNotification} type={this.props.notification.contentType}>
                                {this.props.notification.text}
                            </Alert>;
            }
        }

        let id = this.props.notification ? `${this.props.notification.type}-${this.props.notification.contentType}` : null;
        
        // MAKE IT WORK FFS
        return (
            <EzAnime transitionName={`animation--fadeInOut`}>
                <div id={id} className={`notification_system ${component ? "notification_system-active" : ""}`}>
                    {component}
                </div>
            </EzAnime>
        );
    }
}
