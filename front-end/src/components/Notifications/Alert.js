import React from 'react';
import { IonIcon } from '../IonIcons/IonIcon';

export const Alert = props => {
    let title = <React.Fragment>Info <IonIcon icon="information-circle-outline" /></React.Fragment>;
    let gradient = "linear-gradient(to left bottom, #028da8, #8e44ad)";

    const onClick = index => {
        props.onDismiss();
        if (props.actions[index].onClick) {
            props.actions[index].onClick();
        }
    };

    if (props.type === "warning") {
        title = <React.Fragment>{props.title || "Warning"} <IonIcon icon="warning-outline" /></React.Fragment>;
        gradient = "linear-gradient(to left bottom, #ffa704, #8e44ad)";
    }
    else if (props.type === "error") {
        title = <React.Fragment>{props.title || "Error"} <IonIcon icon="close-circle-outline" /></React.Fragment>;
        gradient = "linear-gradient(to left bottom, #d80000, #8e44ad)";
    }
    else if (props.type === "success") {
        title = <React.Fragment>{props.title || "Success"} <IonIcon icon="checkmark-circle-outline" /></React.Fragment>;
        gradient = "linear-gradient(to left bottom, #028da8, #1abc9c)";
    }

    return (
        <div className="alert--background">
            <div className="alert">
                <div style={{backgroundImage: gradient}} className="alert--title">
                    <span className="alert--title--text">
                        {title}
                    </span>
                </div>
                <div className="alert--content">
                    {props.children}
                </div>
                <div className="alert--actions">
                    <div className={`flex--filler ${props.actions[1] ? "flex--align-right" : "flex--align-center"}`}>
                        <div onClick={() => onClick(0)} className={`alert--actions--item alert--actions--item-important alert--actions--item-important-${props.type}`}>
                            {props.actions[0].text}
                        </div>
                    </div>
                    {
                        props.actions[1] &&
                            <React.Fragment>
                                <div style={{width: "3rem"}}>
                                </div>
                                <div className="flex--filler flex--align-left">
                                        <div onClick={() => onClick(1)} className="alert--actions--item">
                                            {props.actions[1].text}
                                        </div>
                                </div>
                            </React.Fragment>
                    }
                </div>
            </div>
        </div>
    )
};
