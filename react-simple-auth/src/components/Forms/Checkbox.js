import React, { useState } from 'react';
import EzAnimate from '../Animations/EzAnimate';
import { IonIcon } from '../IonIcons/IonIcon';

export const Checkbox = props => {
    const [isChecked, setIsChecked] = useState(props.defaultValue ? true : false);

    const onChange = e => {
        setIsChecked(!isChecked);
        if (props.onSelect) {
            props.onSelect(!isChecked);
        }
    };
    
    return (
        <div onClick={props.onClick} className={`checkbox ${props.className}`}>
            <label className={`checkbox--label ${isChecked ? "checkbox--label-selected" : ""}`} htmlFor={props.id}>
                <EzAnimate transitionName="animation--fadeInOut">
                    {
                        isChecked &&
                            <IonIcon className="checkbox--label--icon" icon="checkmark-outline" />
                    }
                </EzAnimate>
            </label>
            <input className="checkbox--input" type="checkbox" onChange={onChange} checked={isChecked} id={props.id} />
        </div>
    )
}
