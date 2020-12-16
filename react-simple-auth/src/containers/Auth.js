import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import { setCookie } from '../Utils';
import { IonIcon } from '../components/IonIcons/IonIcon';
import { Button } from '../components/Forms/Button';

const signinForm = {
    "title": "Sign In",
    "subtitle": "Sign in with your email or phone",
    "submitButton": {submit: "Sign in", continue: "Continue"},
    "inputGroups": [
        {
            "inputs": [
                {key: "email", text: "Email", type: "email", required: true},
                {key: "password", text: "Password", type: "password", required: true, minLength: "6"}
            ]
        }
    ],
};

const signupForm = {
    "title": "Sign Up",
    "subtitle": "Sign up with your email or phone",
    "submitButton": {submit: "Sign up", continue: "Continue"},
    "inputGroups": [
        {
            "inputs": [
                {key: "name", text: "Name", minLength: "2", type: "text", required: true},
                {key: "email", text: "Email", type: "email", required: true}
            ]
        },
        {
            "inputs": [
                {key: "city", text: "City", type: "text"},
                {key: "country", text: "Country", type: "text", required: true}
            ]
        },
        {
            "inputs": [
                {key: "password", text: "Password", type: "password", required: true, minLength: "6"}
            ]
        }
    ]
};

const resetForm = {
    "title": "Reset password",
    "subtitle": "You will recieve a password reset link on your email",
    "submitButton": {submit: "Reset password", continue: "Continue"},
    "inputGroups": [
        {
            "inputs": [
                {key: "email", text: "Email", type: "email", required: true}
            ]
        }        
    ]
};

const resetLinkForm = {
    "title": "Reset password",
    "subtitle": "Enter a new password",
    "submitButton": {submit: "Reset password", continue: "Continue"},
    "inputGroups": [
        {
            "inputs": [
                {key: "password", text: "Password", type: "password", required: true}
            ]
        }        
    ]
};

const EActiveMode = {
    SIGN_IN: "sign_in",
    SIGN_UP: "sign_up",
    RESET: "reset",
    RESET_LINK: "reset-link",
};

export default class Auth extends Component {
    constructor(props) {
        super(props);

        let activeMode = EActiveMode.SIGN_IN;
        let inputData = this.getInitialInputData();
        let redirectDestination = new URLSearchParams(props.location.search).get("redirectTo");

        switch (this.props.location.pathname) {
            case "/signin":
                activeMode = EActiveMode.SIGN_IN;
                break; 
            case "/signup":
                activeMode = EActiveMode.SIGN_UP;
                break; 
            case "/reset":
                activeMode = EActiveMode.RESET;
                break; 
            case "/reset-link":
                activeMode = EActiveMode.RESET_LINK;
                break; 
            default:
                break; 
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
            inputsEdited: [],
            destination: "", 
            currentInputGroup: 0, 
            activeMode: activeMode,
            redirectDestination: redirectDestination ? redirectDestination : "dashboard",
            showingInputs: [],
            firstRun: true
        };        
    }
    
    componentDidUpdate(prevProps) {
        if (prevProps.location.pathname !== this.props.location.pathname) {
            let activeMode = EActiveMode.SIGN_IN;
            let inputData = this.getInitialInputData();
            let redirectDestination = new URLSearchParams(this.props.location.search).get("redirectTo");

            switch (this.props.location.pathname) {
                case "/signin":
                    activeMode = EActiveMode.SIGN_IN;
                    break; 
                case "/signup":
                    activeMode = EActiveMode.SIGN_UP;
                    break; 
                case "/reset":
                    activeMode = EActiveMode.RESET;
                    break;
                case "/reset-link":
                    activeMode = EActiveMode.RESET_LINK;
                    break; 
                default:
                    break; 
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
                inputsEdited: [],
                currentInputGroup: 0, 
                activeMode: activeMode,
                redirectDestination: redirectDestination ? redirectDestination : "dashboard",
                showingInputs: [],
                firstRun: false
            });
        }
    };

    getInitialInputData = () => {
        let inputData = {};

        switch (this.props.location.pathname) {
            case "/signin":
                [].concat(...signinForm.inputGroups.map(ig => ig.inputs)).forEach(el => { inputData[el.key] = ""; inputData[el.key+"_error"] = ""; });
                break; 
            case "/signup":
                [].concat(...signupForm.inputGroups.map(ig => ig.inputs)).forEach(el => { inputData[el.key] = ""; inputData[el.key+"_error"] = ""; });
                break; 
            case "/reset":
                [].concat(...resetForm.inputGroups.map(ig => ig.inputs)).forEach(el => { inputData[el.key] = ""; inputData[el.key+"_error"] = ""; });
                break;
            case "/reset-link":
                [].concat(...resetLinkForm.inputGroups.map(ig => ig.inputs)).forEach(el => { inputData[el.key] = ""; inputData[el.key+"_error"] = ""; });
                break; 
            default:
                break; 
        }

        return inputData;
    }
    
    generateForm = () => {
        let inputData = signinForm;
        if (this.state.activeMode === EActiveMode.SIGN_UP) {
            inputData = signupForm;
        }
        else if (this.state.activeMode === EActiveMode.RESET) {
            inputData = resetForm;
        }
        else if (this.state.activeMode === EActiveMode.RESET_LINK) {
            inputData = resetLinkForm;
        }

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
                                    <input {...el} key={null} type={this.state.showingInputs.includes(el.key) ? "text" : el.type} name={el.key} onChange={this.handleInputChange} value={this.state.inputData[el.key]} className={`auth--container--main--list--item--input ${this.state.inputsEdited.includes(el.key) ? "auth--container--main--list--item--input-edited" : ""}  ${el.type === "password" ? "auth--container--main--list--item--input-password" : ""}`} />
                                    {
                                        el.type === "password" &&
                                            <Button onClick={() => this.setState({...this.state, showingInputs: this.state.showingInputs.includes(el.key) ? this.state.showingInputs.filter(el2 => el2 !== el.key) : [...this.state.showingInputs, el.key]})} className="auth--container--main--list--item--input-show--button" wrapperClassName="auth--container--main--list--item--input-show" disableDefaultStyle={true} hintText={`${this.state.showingInputs.includes(el.key) ? "Hide" : "Show"} ${el.text.toLowerCase()}`}>
                                                <IonIcon className="auth--container--main--list--item--input-show--icon" icon={this.state.showingInputs.includes(el.key) ? "eye-off-outline" : "eye-outline"} />
                                            </Button>
                                    }
                                    <div className="auth--container--main--list--item--label-error--container">
                                        <IonIcon style={this.state.inputData[el.key+"_error"] === "" ? {display: "none" } : {display: "inline-block" }} icon="alert-circle-outline" className="auth--container--main--list--item--label-error--icon" />
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
            inputsEdited: this.state.inputsEdited.includes(e.target.name) ? this.state.inputsEdited : [...this.state.inputsEdited, e.target.name],
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
            if (this.state.activeMode === EActiveMode.SIGN_IN) {
                this.signIn(this.state.inputData);
            }
            else if (this.state.activeMode === EActiveMode.RESET) {
                this.generatePasswordResetLink(this.state.inputData);
            }
            else if (this.state.activeMode === EActiveMode.RESET_LINK) {
                this.resetPassword(this.state.inputData);
            }
            else if (this.state.activeMode === EActiveMode.SIGN_UP) {
                this.signUp(this.state.inputData);
            }
        }
        else {
            this.setState({...this.state, animations: {...this.state.animations, inputGroup: "auth--container--main--list--animation-exit"}});
        }
    };

    resetPassword = async data => {
        try {
            this.setState({...this.state, loading: true, animations: {...this.state.animations, loader: "auth--loader--animated-show"}});
            let key = new URLSearchParams(this.props.location.search).get("key");

            const requestBody = {
                key: key,
                password: data.password
            };
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            await axios.post("http://localhost:4000/api/user/password-reset/reset", requestBody, config);
            this.props.showNotification({
                type: "toast",
                contentType: "success",
                text: "Password resetted successfully",
                time: 2
            });

            this.setState({...this.state, inputData: this.getInitialInputData(), loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}});
            setTimeout(() => this.props.history.push("/signin"), 2000);
        }
        catch (err) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying to reset your password",
                time: 3
            });
            console.error("An error occured while trying to reset your password");
            console.log(err);
            this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}});
        }
    };

    generatePasswordResetLink = async data => {
        this.setState({...this.state, loading: true, animations: {...this.state.animations, loader: "auth--loader--animated-show"}});
        
        const requestBody = {
            email: data.email
        };
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };
        try {
            await axios.post("http://localhost:4000/api/user/password-reset/generate", requestBody, config);
            this.props.showNotification({
                type: "toast",
                contentType: "success",
                text: "Password reset link sent successfully",
                time: 2
            });

            this.setState({...this.state, inputData: this.getInitialInputData(), loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}});
        } 
        catch (err) {
            this.props.showNotification({
                type: "toast",
                contentType: "error",
                text: "An error occured while trying to generate a password reset link",
                time: 3
            });
            console.error("An error occured while trying to generate a password reset link");
            console.log(err);
            this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", email_error: "", password_error: "Wrong email or password"}});
        }
    };

    // TODO: Improve error handling
    signIn = async data => {
        this.setState({...this.state, loading: true, animations: {...this.state.animations, loader: "auth--loader--animated-show"}});
        
        const requestBody = {
            email: data.email,
            password: data.password
        };
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            let res = await axios.post("http://localhost:4000/api/user", requestBody, config);
            this.setState({...this.state, inputData: this.getInitialInputData(), loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}});
            this.props.saveUserData(true, res.data.userData);
            setCookie("session", res.data.userData.user._id, 1);
        } 
        catch (err) {
            console.error("An error occured while trying to sign in");
            console.log(err);
            this.setState({...this.state, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", email_error: "", password_error: "Incorrect email or password."}});
            this.props.saveUserData(false);
        }
    };

    // TODO: Improve error handling
    signUp = async data => {
        this.setState({...this.state, loading: true, animations: {...this.state.animations, loader: "auth--loader--animated-show"}})
        
        const requestBody = {
            email: data.email,
            password: data.password,
            name: data.name,
            country: data.country,
            city: data.city,
        };
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        try {
            let res = await axios.post("http://localhost:4000/api/user/new", requestBody, config);
            this.setState({...this.state, inputData: this.getInitialInputData(), loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}});
            this.props.saveUserData(true, res.data.userData);
            setCookie("session", res.data.userData.user._id, 1);
        } 
        catch (err) {
            console.error("An error occured while trying to sign up");
            console.log(err);

            let error = "Server Error";
            if (err.response.data.name === "UserExistsError") {
                error = "Email already used";
            }

            this.setState({...this.state, currentInputGroup: 0, loading: false, animations: {...this.state.animations, loader: "auth--loader--animated-hide"}, inputData: {...this.state.inputData, password: "", password_error: "", email_error: error}});
            this.props.saveUserData(false);
        }
    };

    handleAnimationFinish = e => {
        if (this.state.destination !== "") {
            this.props.history.push(`${this.state.destination}${this.state.redirectDestination !== "dashboard" ? `?redirectTo=${this.state.redirectDestination}` : ""}`);
        }
        else {
            this.setState({...this.state, firstRun: false, animations: {...this.state.animations, main: ""}});
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
                <div className="auth--nav">
                    <div style={{backgroundImage: `url(/logo-white.png)`}} className="auth--nav--logo" />
                    <div className="auth--nav--actions">
                        <div className={`auth--nav--item ${this.state.activeMode === EActiveMode.SIGN_IN ? "auth--nav--item-active" : ""}`} onClick={() => this.state.activeMode === EActiveMode.SIGN_IN ? null : this.setState({...this.state, destination: "/signin", animations: {...this.state.animations, main: "auth--animation-exit"}})}>
                            Sign in
                        </div>
                        <div className={`auth--nav--item ${this.state.activeMode === EActiveMode.SIGN_UP ? "auth--nav--item-active" : ""}`} onClick={() => this.state.activeMode === EActiveMode.SIGN_UP ? null :  this.setState({...this.state, destination: "/signup", animations: {...this.state.animations, main: "auth--animation-exit"}})}>
                            Sign up
                        </div>
                    </div>
                </div>
                <div style={{opacity: this.state.firstRun ? 0 : null, animationDelay: this.state.firstRun ? "0.3s" : null}} onAnimationEnd={this.handleAnimationFinish} className={`auth--container ${this.state.animations.main}`}>
                    <div style={{marginTop: this.state.activeMode === EActiveMode.RESET_LINK ? "-5rem" : null}} className="auth--container--main">
                        {
                            this.generateForm()
                        }
                        <div className="auth--container--main--reset">
                            { this.state.activeMode === EActiveMode.SIGN_IN &&
                                <React.Fragment>Can't sign in?  <span onClick={() => { this.setState({...this.state, destination: "/reset", animations: {...this.state.animations, main: "auth--animation-exit"}});}} className="auth--container--main--alternative--link">Reset password</span></React.Fragment>
                            }
                        </div>
                        {
                            this.state.activeMode !== EActiveMode.RESET && this.state.activeMode !== EActiveMode.RESET_LINK ?
                                <div className="auth--container--main--alternative">
                                    { this.state.activeMode === EActiveMode.SIGN_IN ?
                                        (<React.Fragment>Don't have an account?  <span onClick={() => { this.setState({...this.state, destination: "/signup", animations: {...this.state.animations, main: "auth--animation-exit"}});}} className="auth--container--main--alternative--link">Sign Up</span></React.Fragment>) 
                                        :
                                        (<React.Fragment>Already have an account?  <span onClick={() => { this.setState({...this.state, destination: "/signin", animations: {...this.state.animations, main: "auth--animation-exit"}});}} className="auth--container--main--alternative--link">Sign In</span></React.Fragment>) 
                                    }
                                </div>
                            :
                                this.state.activeMode === EActiveMode.RESET &&
                                    <div className="auth--container--main--alternative">
                                        <React.Fragment>Remembered your password?  <span onClick={() => { this.setState({...this.state, destination: "/signin", animations: {...this.state.animations, main: "auth--animation-exit"}});}} className="auth--container--main--alternative--link">Sign In</span></React.Fragment>
                                    </div>
                        }
                        <div onAnimationEnd={this.handleLoaderAnimationFinish} style={{display: this.state.animations.loader !== "" || this.state.loading ? "flex" : "none"}} className={`auth--loader ${this.state.animations.loader}`}>
                            <div className="auth--loader--icons">
                                <span className="auth--loader--icon auth--loader--icon-1"></span>
                                <span className="auth--loader--icon auth--loader--icon-2"></span>
                                <span className="auth--loader--icon auth--loader--icon-3"></span>
                            </div>
                        </div>
                    </div>
                    {
                        this.state.activeMode !== EActiveMode.RESET_LINK &&
                            <div className="auth--container--or">
                                OR
                            </div>
                    }
                    <div className="auth--container--side">
                        {
                            this.state.activeMode !== EActiveMode.RESET_LINK &&
                                <div className="auth--container--side--actions">
                                    <div className="auth--container--side--actions--item auth--container--side--actions--item-google">
                                        <svg className="auth--container--side--actions--item-google--icon" width="2443" height="2500" viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4"/><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853"/><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05"/><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335"/></svg>
                                        Continue with Google
                                    </div>
                                    <div className="auth--container--side--actions--item auth--container--side--actions--item-facebook">
                                        <img alt="" className="auth--container--side--actions--item-facebook--icon" src="./f-logo.png" />Continue with Facebook
                                    </div>
                                </div>
                        }
                    </div>
                    <div className="auth--container--mobile_side">
                        <div className="auth--container--mobile_side--or">OR</div>
                        <div className="auth--container--mobile_side--options">
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
