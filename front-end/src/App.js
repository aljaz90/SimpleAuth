import React, { Component } from 'react';
import Auth from './containers/Auth';
import Home from './containers/Home';
import NotificationSystem from './containers/NotificationSystem';
import { TutorialSystem } from './containers/TutorialSystem';
import { Route, Switch } from 'react-router-dom';
import { Layout } from './containers/Layout';
import { getCookie, getUser, isEmpty } from './Utils';

export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated: false,
            user: {},
            notification: null,
            notificationsBuffer: []
        };

        this.setters = {
            setUser: user => {
                this.setState({ ...this.state, user: { ...this.state.user, ...user } });
            }
        };
    };

    componentDidMount() {
        if (getCookie("session")) {
            this.setState({...this.state, isAuthenticated: true});
            getUser(this.saveUserData);
        }
    }
    
    showNotification = (notification, removeFromBuffer = false) => {
        if (this.state.notification) {
            if (removeFromBuffer) {
                if (notification.type === "toast" && notification.time > 0) {
                    setTimeout(() => this.dismissNotification(), notification.time * 1000);
                }
                let notificationsBuffer = this.state.notificationsBuffer.slice(1);
                this.setState({ ...this.state, notification, notificationsBuffer });
            }
            else {
                this.setState({ ...this.state, notificationsBuffer: [...this.state.notificationsBuffer, notification] });
            }
        }
        else {
            if (notification.type === "toast" && notification.time > 0) {
                setTimeout(() => this.dismissNotification(), notification.time * 1000);
            }
            this.setState({ ...this.state, notification });
        }
    };

    dismissNotification = () => {
        if (this.state.notificationsBuffer.length > 0) {
            this.showNotification(this.state.notificationsBuffer[0], true);
        }
        else {
            this.setState({ ...this.state, notification: null });
        }
    };

    saveUserData = (isAuthenticated, data = {}, callback = null) => {
        let newState = { ...this.state, isAuthenticated, user: {}, courses: [], enrolls: [] };
        if (isAuthenticated) {
            newState.user = data.user;
        }
        this.setState(newState, () => { if (callback) { callback(); } });
    };


    render() {
        return (
            <div className="container">
                <NotificationSystem dismissNotification={() => this.dismissNotification()} notification={this.state.notification} />
                {
                    this.state.isAuthenticated && !isEmpty(this.state.user) &&
                        <TutorialSystem {...this.state} {...this.setters} />
                }
                <Layout {...this.state} {...this.setters} showNotification={this.showNotification} saveUserData={this.saveUserData} />
                <Switch>
                    <Route exact path="/" render={props => <Home />} />
                    <Route path="/signin" render={props => <Auth showNotification={this.showNotification} {...this.state} {...this.setters} {...props} saveUserData={this.saveUserData} />} />
                    <Route path="/signup" render={props => <Auth showNotification={this.showNotification} {...this.state} {...this.setters} {...props} saveUserData={this.saveUserData} />} />
                    <Route path="/reset" render={props => <Auth showNotification={this.showNotification} {...this.state} {...this.setters} {...props} saveUserData={this.saveUserData} />} />
                    <Route path="/reset-link" render={props => <Auth showNotification={this.showNotification} {...this.state} {...this.setters} {...props} saveUserData={this.saveUserData} />} />
                </Switch>
            </div>
        );
    }
}