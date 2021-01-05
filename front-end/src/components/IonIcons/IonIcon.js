import React from 'react';
import ICONS from './icons';

export const IonIcon = props => {

    let key = null;
    if (props.icon) {
        key = props.icon;
    }
    else if (props.name) {
        key = props.name;
    }

    if (!(key in  ICONS)) {
        return null;
    }

    return React.cloneElement(ICONS[key], {
        className: `${ICONS[key].props.className} ${props.className ? props.className : ""}`,
        onClick: props.onClick ? props.onClick : null,
        style: props.style ? props.style : null,
        onAnimationEnd: props.onAnimationEnd ? props.onAnimationEnd : null
    });
};