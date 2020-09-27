import React, { Component } from 'react';
import { Route, Switch, NavLink, Redirect } from 'react-router-dom';
import Auth from './containers/Auth';
import Home from './Home';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      user: null
    }
  };

  setUserData = (isAuthenticated, data=null) => {
    this.setState({...this.state, isAuthenticated: isAuthenticated, user: data});
  };

  render() {
    return (
      <React.Fragment>
        <div className="nav">
          <div className="nav--logo">
            Auth.Simple  
          </div>
          <div className="nav--nav">
            <NavLink activeClassName="nav--nav--item-active" className="nav--nav--item" to="/signin">
              Sign in
            </NavLink>
            <NavLink activeClassName="nav--nav--item-active" className="nav--nav--item" to="/signup">
              Sign up
            </NavLink>
          </div>
        </div>
        <Switch>
          <Route exact path="/" render={props => <Home {...props} />} />
          <Route exact path="/signin" render={props => <Auth {...props} isAuthenticated={this.state.isAuthenticated} saveUserData={this.setUserData} />} />
          <Route exact path="/signup" render={props => <Auth {...props} isAuthenticated={this.state.isAuthenticated} saveUserData={this.setUserData} />} />
          <Route path="*" render={props => <Redirect to="/signin" />} />
        </Switch>
      </React.Fragment>
    );
  }
}