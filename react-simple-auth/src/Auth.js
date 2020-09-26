import React, { Component } from 'react'
import axios from 'axios';
import querystring from 'querystring';

const signinForm = {
    "header": "Sign In",
    "subheader": "Sign in with your email or phone.",
    "submitButtom": {name: "Sign in", continue: "Continue"},
    "inputGroups": [
        {
            "inputs": [
                {name: "email", type: "email", required: true},
                {name: "password", type: "password", required: true, minLength: "6"},
            ]
        }
    ],
    "inputs": [
        {name: "email", type: "email", required: true},
        {name: "password", type: "password", required: true, minLength: "6"},
    ]
}

const signupForm = {
    "header": "Sign Up",
    "subheader": "Sign up with your email or phone.",
    "submitButtom": {name: "Sign up", continue: "Continue"},
    "inputGroups": [
        {
            "inputs": [
                {name: "username", minLength: "5", type: "text", required: true},
                {name: "email", type: "email", required: true},
            ]
        },
        {
            "inputs": [
                {name: "password", type: "password", required: true, minLength: "6"},
                {name: "password_confirmation", type: "password", required: true, minLength: "6"},
            ]
        }
    ],
    "inputs": [
        {name: "username", minLength: "5", type: "text", required: true},
        {name: "email", type: "email", required: true},
        {name: "password", type: "password", required: true, minLength: "6"},
        {name: "password_confirmation", type: "password", required: true, minLength: "6"},
    ]
}


export default class Auth extends Component {
    constructor(props) {
        super(props);

        let signingIn = this.props.location.pathname === "/signin";
        let inputData = {};
        if (signingIn)
            signinForm.inputs.forEach(el => {inputData[el.name] = ""; inputData[el.name+"_error"] = ""; });
        else
            signupForm.inputs.forEach(el => {inputData[el.name] = ""; inputData[el.name+"_error"] = ""; });

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
            signingIn: signingIn
        };

        if (localStorage.getItem('token') !== null) {
            this.getUser();
        }
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            let signingIn = this.props.location.pathname === "/signin";
            let inputData = {};
            if (signingIn)
                signinForm.inputs.forEach(el => {inputData[el.name] = ""; inputData[el.name+"_error"] = ""; });
            else
                signupForm.inputs.forEach(el => {inputData[el.name] = ""; inputData[el.name+"_error"] = ""; });

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
                signingIn: signingIn
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
                this.props.onAuthChanged(res.data, true);
            } 
            else {
                this.props.onAuthChanged({}, false);
            }
        })
        .catch(err => {
            console.log(err);
            this.props.onAuthChanged({}, false);
        });
    };
    
    generateForm = inputData => {
        return (
            <React.Fragment>
                <div className="auth--container--main--header">
                    {inputData.header}
                </div>
                <div style={ inputData.inputs.length > 2 ? {marginBottom: "2rem"} : {}} className="auth--container--main--subheader">
                    {inputData.subheader}
                </div>
                <form onSubmit={(e) => this.handleSubmit(e, this.state.currentInputGroup === inputData.inputGroups.length - 1)}>
                    <div onAnimationEnd={this.handleInputAnimationFinish} className={`auth--container--main--list ${this.state.animations.inputGroup}`}>
                         { 
                            inputData.inputGroups[this.state.currentInputGroup].inputs.map(el => (
                                <div key={el.name} className="auth--container--main--list--item">
                                    <label htmlFor={el.name} className="auth--container--main--list--item--label">{el.name}</label>
                                    <input {...el} onChange={this.handleInputChange} value={this.state.inputData[el.name]} className="auth--container--main--list--item--input" />
                                    <div className="auth--container--main--list--item--label-error--container">
                                        <span style={this.state.inputData[el.name+"_error"] === "" ? {display: "none" } : {display: "inline-block" }} className="auth--container--main--list--item--label-error--icon"></span>
                                        <label className="auth--container--main--list--item--label auth--container--main--list--item--label-error">
                                            {this.state.inputData[el.name+"_error"]}
                                        </label>
                                    </div>
                                </div>
                            ))
                        }                        
                    </div>
                    <input className="auth--container--main--submit" type="submit" value={this.state.currentInputGroup === inputData.inputGroups.length - 1 ? inputData.submitButtom.name : inputData.submitButtom.continue } />
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
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("tokenExpiration", res.data.tokenExpiration);
                this.setState({...this.state, inputData: {}, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}});
                this.props.onAuthChanged(res.data.user, true);
            } 
            else {
                this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", email_error: "", password_error: "Incorrect email or password."}});
                this.props.onAuthChanged({}, false);
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", email_error: "", password_error: "Incorrect email or password."}});
            this.props.onAuthChanged({}, false);
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
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("tokenExpiration", res.data.tokenExpiration);
                this.setState({...this.state, inputData: {}, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}});
                this.props.onAuthChanged(res.data.user, true);
            } 
            else {
                this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", password_confirmation: "", password_error: "", password_confirmation_error: "Server Error."}});
                this.props.onAuthChanged({}, false);
            }
        })
        .catch(err => {
            console.log(err);
            this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", password_confirmation: "", password_error: "", password_confirmation_error: "Server Error."}});
            this.props.onAuthChanged({}, false);
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
                    <div className="auth--container--side">

                    </div>
                </div>
            </div>
        )
    }
}
