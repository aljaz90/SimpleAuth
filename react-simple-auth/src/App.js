import React, { Component } from 'react';
import { Route, Switch, NavLink } from 'react-router-dom';
import Auth from './Auth';
import Test from './Test';


export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: false,
      user: {}
    }
  };

  handleAuthChanged = (data, isAuthenticated) => {
    console.log("handleAuthChanged")
    console.log(data)
  };

  render() {
    return (
      <React.Fragment>
        <div className="nav">
          <div className="nav--logo">
            Oxi.Labs  
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
          <Route exact path="/signin" render={props => <Auth {...props} onAuthChanged={this.handleAuthChanged} />} />
          <Route exact path="/test" component={Test} />
          <Route exact path="/signup" render={props => <Auth {...props} onAuthChanged={this.handleAuthChanged} />} />
        </Switch>
      </React.Fragment>
    );
  }
}