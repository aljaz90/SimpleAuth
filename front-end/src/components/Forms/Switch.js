import React, { useState } from 'react';
import { IonIcon } from '../IonIcons/IonIcon';

export const Switch = props => {
    const [selectedOption, setSelectedOption] = useState(props.defaultOption ? props.defaultOption : props.options[0].key ? props.options[0].key : props.options[0]);
    const onSelect = option => {
        setSelectedOption(option);
        props.onSelect(option);
    };

    const onSelectNext = () => {
        let currentIndex = props.options.findIndex(el => (el.key ? el.key : el) === selectedOption);
        let nextOption = props.options.length - 1 === currentIndex ? props.options[0] : props.options[currentIndex+1];
        let option = nextOption.key ? nextOption.key : nextOption;
        setSelectedOption(option);
        props.onSelect(option);
    };

    if (props.type === "nav") {
        return (
            <div className={`switch-nav ${props.className}`}>
                {
                    props.options.map(el => 
                        <div key={el.key ? el.key : el} onClick={() => onSelect(el.key ? el.key : el)} className={`switch--option-nav ${(el.key ? el.key : el) === selectedOption ? "switch--option-nav-selected" : ""} ${props.optionClassName}`}>
                            {
                                el.icon &&
                                    <IonIcon name={el.icon} className="switch--option--icon" />
                            }
                            {el.text ? el.text : el}
                        </div>
                    )
                }
            </div>
        );
    }

    return (
        <div onClick={() => onSelectNext()} className={`switch ${props.className}`}>
            {
                props.options.map(el => 
                    <div key={el.key ? el.key : el} className={`switch--option ${(el.key ? el.key : el) === selectedOption ? "switch--option-selected" : ""} ${props.optionClassName}`}>
                        {
                            el.icon &&
                                <IonIcon name={el.icon} className="switch--option--icon" />
                        }
                        {el.text ? el.text : el}
                    </div>
                )
            }
        </div>
    );
}
