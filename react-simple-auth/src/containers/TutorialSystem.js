import React, { useState } from 'react';
import EzAnimate from '../components/Animations/EzAnimate';
import config from '../config/config';
import axios from 'axios';
import { Button } from '../components/Forms/Button';
import { IonIcon } from '../components/IonIcons/IonIcon';

export const TutorialSystem = props => {
    const [showing, setShowing] = useState(!props.user.completed_tutorial);
    const [currentStep, setCurrentStep] = useState(null);
    const [animationsDisabled, setAnimationsDisabled] = useState(false);

    const handleOnTutorialComplete = async () => {
        const requestBody = {
            completed_tutorial: true
        };
        const config = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        try {
            await axios.put("http://localhost:4000/api/user", requestBody, config);
            setAnimationsDisabled(false);
            setShowing(false);    
        }
        catch (err) {
            console.error("An error occured while trying save user settings");
            console.log(err);
            setAnimationsDisabled(false);
            setShowing(false);
        }
    };

    let content = (
        <div className="tutorial_system--container">
            <IonIcon icon="close-outline" className="tutorial_system--container--cancel" onClick={() => handleOnTutorialComplete()} />
            <div className="tutorial_system--container--title">
                {config.TUTORIAL.TITLE}
            </div>
            <img draggable={false} className="tutorial_system--container--logo" src={config.TUTORIAL.LOGO} alt="logo" />
            <div className="tutorial_system--container--text">
                {config.TUTORIAL.TEXT}
            </div>
            <Button className="tutorial_system--container--start" onClick={() => {setAnimationsDisabled(true); setCurrentStep(0)}}>
                Start
            </Button>
        </div>
    );
    if (currentStep !== null) {
        let step = config.TUTORIAL.STEPS[currentStep];
        if (step) {
            console.log("NOT NULL")
            content = (
                <div style={{...step.POSITION}} className="tutorial_system--step">
                    <div className={`tutorial_system--step--container tutorial_system--step--container-${step.ARROW_POSITION}`}>
                        <div className="tutorial_system--step--header">
                            {step.ICON && <IonIcon icon={step.ICON} className="tutorial_system--step--header--icon" />}
                            {step.TITLE}
                        </div>
                        <div className="tutorial_system--step--text">
                            {step.TEXT}
                        </div>
                        <div className="tutorial_system--step--actions">
                            <div className="tutorial_system--step--actions--skip" onClick={() => handleOnTutorialComplete()}>
                                Skip
                            </div>
                            <Button className="tutorial_system--step--actions--continue" onClick={() => (currentStep === config.TUTORIAL.STEPS.length - 1) ? handleOnTutorialComplete() : setCurrentStep(currentStep+1)}>
                                {(currentStep === config.TUTORIAL.STEPS.length - 1) ? "Finish" : "Continue"}
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <EzAnimate disabled={animationsDisabled} transitionName="animation--fadeInOut">
            {
                showing && 
                    <div className="tutorial_system tutorial_system-active">
                        <div className="tutorial_system--background">
                            {content}
                        </div>
                    </div>
            }
        </EzAnimate>
    );
}
