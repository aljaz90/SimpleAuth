import React, { Component } from 'react'
import axios from 'axios';
import querystring from 'querystring';
import { Redirect } from 'react-router';

const signinForm = {
    "title": "Sign In",
    "subtitle": "Sign in with your email or phone.",
    "submitButton": {submit: "Sign in", continue: "Continue"},
    "inputGroups": [
        {
            "inputs": [
                {key: "email", text: "Email", type: "email", required: true},
                {key: "password", text: "Password", type: "password", required: true, minLength: "6"},
            ]
        }
    ],
};

const signupForm = {
    "title": "Sign Up",
    "subtitle": "Sign up with your email or phone.",
    "submitButton": {submit: "Sign up", continue: "Continue"},
    "inputGroups": [
        {
            "inputs": [
                {key: "username", text: "Username", minLength: "2", type: "text", required: true},
                {key: "email", text: "Email", type: "email", required: true},
            ]
        },
        {
            "inputs": [
                {key: "password", text: "Password", type: "password", required: true, minLength: "6"},
                {key: "password_confirmation", text: "Password confirmation", type: "password", required: true, minLength: "6"},
            ]
        }
    ]
};

export default class Auth extends Component {
    constructor(props) {
        super(props);

        let signingIn = this.props.location.pathname === "/signin";
        let inputData = {};
        let redirectDestination = new URLSearchParams(props.location.search).get("redirectTo");

        if (signingIn) {
            [].concat(...signinForm.inputGroups.map(ig => ig.inputs)).forEach(el => { inputData[el.key] = ""; inputData[el.key+"_error"] = ""; });
        }
        else {
            [].concat(...signupForm.inputGroups.map(ig => ig.inputs)).forEach(el => { inputData[el.key] = ""; inputData[el.key+"_error"] = ""; });
        }

        this.state = {
            animations: {
                inputGroup: "",
                main: "auth--animation-enter",
                loader: ""
            },
            notifications: {
                main: "",
            },
            loading: false,
            inputData: inputData,
            destination: "", 
            currentInputGroup: 0, 
            signingIn: signingIn,
            redirectDestination: redirectDestination ? redirectDestination : ""
        };

        /*if (document.cookie.indexOf('express:sess') === -1) { 
            getUser(this.saveUserData);
        }*/
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            let signingIn = this.props.location.pathname === "/signin";
            let inputData = {};
            let redirectDestination = new URLSearchParams(this.props.location.search).get("redirectTo");

            if (signingIn) {
                [].concat(...signinForm.inputGroups.map(ig => ig.inputs)).forEach(el => { inputData[el.key] = ""; inputData[el.key+"_error"] = ""; });
            }
            else {
                [].concat(...signupForm.inputGroups.map(ig => ig.inputs)).forEach(el => { inputData[el.key] = ""; inputData[el.key+"_error"] = ""; });
            }
            this.setState({
                animations: {
                    inputGroup: "",
                    main: "auth--animation-enter",
                    loader: ""
                },
                notifications: {
                    main: "",
                },
                loading: false,
                inputData: inputData,
                destination: "", 
                currentInputGroup: 0, 
                signingIn: signingIn,
                redirectDestination: redirectDestination ? redirectDestination : "dashboard"
            });
        }
    };

    getUser = () => {
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };
    
        axios.get("http://localhost:4000/api/users", config)
        .then(res => {
            if (res.status === 200) {
                this.props.saveUserData(true, res.data);
            } 
            else {
                this.props.saveUserData(false);
            }
        })
        .catch(err => {
            console.log(err);
            this.props.saveUserData(false);
        });
    };
    
    generateForm = inputData => {
        let inputs = [].concat(...inputData.inputGroups.map(ig => ig.inputs));

        return (
            <React.Fragment>
                <div className="auth--container--main--header">
                    {inputData.title}
                </div>
                <div style={ inputs.length > 2 ? {marginBottom: "2rem"} : {}} className="auth--container--main--subheader">
                    {inputData.subtitle}
                </div>
                <form onSubmit={(e) => this.handleSubmit(e, this.state.currentInputGroup === inputData.inputGroups.length - 1)}>
                    <div onAnimationEnd={this.handleInputAnimationFinish} className={`auth--container--main--list ${this.state.animations.inputGroup}`}>
                         { 
                            inputData.inputGroups[this.state.currentInputGroup].inputs.map(el => (
                                <div key={el.key} className="auth--container--main--list--item">
                                    <label htmlFor={el.key} className="auth--container--main--list--item--label">{el.text}</label>
                                    <input {...el} key={null} name={el.key} onChange={this.handleInputChange} value={this.state.inputData[el.key]} className="auth--container--main--list--item--input" />
                                    <div className="auth--container--main--list--item--label-error--container">
                                        <span style={this.state.inputData[el.key+"_error"] === "" ? {display: "none" } : {display: "inline-block" }} className="auth--container--main--list--item--label-error--icon"></span>
                                        <label className="auth--container--main--list--item--label auth--container--main--list--item--label-error">
                                            {this.state.inputData[el.key+"_error"]}
                                        </label>
                                    </div>
                                </div>
                            ))
                        }                        
                    </div>
                    <input className="auth--container--main--submit" type="submit" value={this.state.currentInputGroup === inputData.inputGroups.length - 1 ? inputData.submitButton.submit : inputData.submitButton.continue } />
                </form>
            </React.Fragment>
        );
    };

    handleInputChange = e => {
        this.setState({
            ...this.state,
            inputData: {
                ...this.state.inputData,
                [e.target.name]: e.target.value
            }
        })
    };

    handleSubmit = (e, lastInputGroup) => {
        e.preventDefault();
        if (this.state.loading) {
            return;
        }

        if (lastInputGroup) {
            if (this.state.signingIn) {
                this.signIn(this.state.inputData);
            }
            else {
                if (this.state.inputData.password === this.state.inputData.password_confirmation)
                    this.signUp(this.state.inputData);
                else 
                    this.setState({...this.state, inputData: {...this.state.inputData,  password_error: "", password_confirmation_error: "Passwords must match."}});
            }
        }
        else {
            this.setState({...this.state, animations: {...this.state.animations, inputGroup: "auth--container--main--list--animation-exit"}});
        }
    };

    signIn = data => {
        this.setState({...this.state, loading: true, animations: {...this.state.animations, loader: "auth--loader--animated-show"}});
        const requestBody = {
            email: data.email,
            password: data.password
        };
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        axios.post("http://localhost:4000/api/users", querystring.stringify(requestBody), config)
        .then(res => {
            if (res.status === 200) {
                this.setState({...this.state, inputData: {}, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}});
                this.props.saveUserData(true, res.data.user);
            } 
            else {
                this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", email_error: "", password_error: "Incorrect email or password."}});
                this.props.saveUserData(false);
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", email_error: "", password_error: "Incorrect email or password."}});
            this.props.saveUserData(false);
        });
    };

    signUp = data => {
        this.setState({...this.state, loading: true, animations: {...this.state.animations, loader: "auth--loader--animated-show"}})
        const requestBody = {
            email: data.email,
            password: data.password,
            username: data.username
        };
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        axios.post("http://localhost:4000/api/users/new", querystring.stringify(requestBody), config)
        .then(res => {
            if (res.status === 200) {
                this.setState({...this.state, inputData: {}, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}});
                this.props.saveUserData(true, res.data.user);
            } 
            else {
                this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", password_confirmation: "", password_error: "", password_confirmation_error: "Server Error."}});
                this.props.saveUserData(false);
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", password_confirmation: "", password_error: "", password_confirmation_error: "Server Error."}});
            this.props.saveUserData(false);
        });
    }

    handleAnimationFinish = e => {
        if (this.state.destination !== "") { 
            this.props.history.push(this.state.destination);
        }
        else {
            this.setState({...this.state, animations: {...this.state.animations, main: ""}});
        }
    };

    handleInputAnimationFinish = e => {
        e.stopPropagation();

        if (this.state.animations.inputGroup === "auth--container--main--list--animation-exit") {
            this.setState({...this.state, currentInputGroup: this.state.currentInputGroup+1, animations: {...this.state.animations, inputGroup: "auth--container--main--list--animation-enter"}});
        }
        else {
            this.setState({...this.state, animations: {...this.state.animations, inputGroup: ""}});
        }
    };
    
    handleLoaderAnimationFinish = e => {
        e.stopPropagation();
        this.setState({...this.state, animations: {...this.state.animations, loader: ""}});
    };

    render() {
        if (this.props.isAuthenticated) {
            return <Redirect to={`/${this.state.redirectDestination}`} />
        }
        return (
            <div className="auth">
                <div onAnimationEnd={this.handleAnimationFinish} className={`auth--container ${this.state.animations.main}`}>
                    <div className="auth--container--main">
                        {
                            this.state.signingIn ?
                                this.generateForm(signinForm)
                            :
                                this.generateForm(signupForm)
                        }
                        <div className="auth--container--main--alternative">
                            { this.state.signingIn ?
                                (<React.Fragment>Don't have an account?  <span onClick={() => { this.setState({...this.state, destination: "/signup", animations: {...this.state.animations, main: "auth--animation-exit"}});}} className="auth--container--main--alternative--link">Sign Up</span></React.Fragment>) 
                                :
                                (<React.Fragment>Already have an account?  <span onClick={() => { this.setState({...this.state, destination: "/signin", animations: {...this.state.animations, main: "auth--animation-exit"}});}} className="auth--container--main--alternative--link">Sign In</span></React.Fragment>) 
                            }
                        </div>
                        <div onAnimationEnd={this.handleLoaderAnimationFinish} style={{display: this.state.animations.loader !== "" || this.state.loading ? "flex" : "none"}} className={`auth--loader ${this.state.animations.loader}`}>
                            <div className="auth--loader--icons">
                                <span className="auth--loader--icon auth--loader--icon-1"></span>
                                <span className="auth--loader--icon auth--loader--icon-2"></span>
                                <span className="auth--loader--icon auth--loader--icon-3"></span>
                            </div>
                        </div>
                    </div>
                    <div className="auth--container--or">
                        OR
                    </div>
                    <div className="auth--container--side">
                        <div className="auth--container--side--actions">
                            <div className="auth--container--side--actions--item auth--container--side--actions--item-google">
                                <svg className="auth--container--side--actions--item-google--icon" width="2443" height="2500" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>
                                Continue with Google
                            </div>
                            <div className="auth--container--side--actions--item auth--container--side--actions--item-facebook">
                                <img alt="" className="auth--container--side--actions--item-facebook--icon" src="./f-logo.png" />Continue with Facebook
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
