import React from 'react';
import { IonIcon } from '../IonIcons/IonIcon';

export const Toast = props => {
    return (
        <div className={`toast toast-${props.type}`}>
            {props.children}
            <IonIcon onClick={() => props.onDismiss()} className="toast--close" icon="close-circle-outline" />
        </div>
    )
}
