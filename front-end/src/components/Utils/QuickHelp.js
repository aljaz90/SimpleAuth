import React from 'react';
import EzAnimate from '../Animations/EzAnimate';
import { Button } from '../Forms/Button';
import { IonIcon } from '../IonIcons/IonIcon';

export const QuickHelp = props => {
    return (
        <EzAnimate transitionName="animation--fadeInOut">
            {
                props.showing &&
                    <div onClick={() => props.onClose()} className="quick_help--background">
                        <div onClick={e => e.stopPropagation()} className="quick_help">
                            <div className="quick_help--header">
                                <div className="quick_help--header--title">
                                    {props.title || "Help"}
                                </div>
                                <Button onClick={() => props.onClose ? props.onClose() : null} className="quick_help--header--close" disableDefaultStyle={true} hintText="Close">
                                    <IonIcon className="quick_help--header--close--icon" icon="close-outline" />
                                </Button>
                            </div>
                            {props.children}
                        </div>
                    </div>
            }
        </EzAnimate>
    );
};
