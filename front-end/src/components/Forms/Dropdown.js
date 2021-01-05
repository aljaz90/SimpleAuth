import React, { useState } from 'react';
import OutsideClick from '../Utils/OutsideClick';
import { IonIcon } from '../IonIcons/IonIcon';
import EzAnimate from '../Animations/EzAnimate';

const defaultIcons = {
    left: {open: "chevron-forward-outline", closed: "chevron-back-outline"},
    right: {open: "chevron-back-outline", closed: "chevron-forward-outline"},
    top: {open: "chevron-down-outline", closed: "chevron-up-outline"},
    bottom: {open: "chevron-up-outline", closed: "chevron-down-outline"},
};

export const Dropdown = props => {

    const [query, setQuery] = useState("");
    const [isAnimationDisabled, setIsAnimationDisabled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const position = props.position ? props.position : "bottom";
    const hintPosition = props.hintPosition ? props.hintPosition : "bottom";

    const onSelect = selectedOption => {
        if (isAnimationDisabled) {
            setIsAnimationDisabled(false);
        }

        setIsDropdownOpen(false); 
        setSelectedOption(selectedOption); 

        if (props.onSelect) {
            props.onSelect(selectedOption);
        }
    };

    let options = props.options || [];
    if (props.searchEnabled && options.length > 5 && query === "") {
        //options = options;
    }
    else if (props.searchEnabled && query !== "") {
        options = options.filter(el => (el.text ? el.text.toLowerCase() : el.toLowerCase()).includes(query.toLowerCase()));
    }

    let selectedOptionText = props.children;
    if (!props.staticButton && selectedOption) {
        let opt = (props.options || []).find(el => (el.key && el.key === selectedOption) || (el.key === undefined && el === selectedOption));
        if (opt && opt.key) {
            selectedOptionText = opt.text;
        }
        else if (opt) {
            selectedOptionText = opt;
        }
    }
    
    if (props.animationsDisabled) {
        return (
            <OutsideClick onOutsideClick={() => { setQuery(""); setIsDropdownOpen(false); }}>
                <div className={`dropdown dropdown-${props.type} ${props.wrapperClassName}`}>
                    <div onClick={() => { setQuery(""); setIsDropdownOpen(!isDropdownOpen); }} className={`dropdown--button dropdown--button-${props.type} ${props.className}`}>
                        {selectedOptionText} <IonIcon className={`dropdown--button--icon ${props.iconClassName}`} name={isDropdownOpen ? props.openIcon ? props.openIcon : defaultIcons[position].open : props.closedIcon ? props.closedIcon : defaultIcons[position].closed} />
                    </div>
                    {
                        props.hintText &&
                            <div className={`dropdown--hint dropdown--hint-${hintPosition}`}>
                                {props.hintText}
                            </div>
                    }
                    <div className={`dropdown--options dropdown--options-${position}`}>
                        {
                            isDropdownOpen &&
                            <React.Fragment>
                                {
                                    props.searchEnabled &&
                                        <div className="dropdown--options--search">
                                            <IonIcon className="dropdown--options--search--icon" icon="search-outline" />
                                            <input onChange={e => setQuery(e.target.value)} autoFocus={true} placeholder="Seach" className="dropdown--options--search--input" />
                                        </div>
                                }
                                {
                                    options.map(option => 
                                        (<div onClick={() => onSelect(option.key ? option.key : option)} className={`dropdown--options--item dropdown--options--item-${props.type}`}>
                                            {option.icon && <IonIcon className={`dropdown--options--item--icon`} name={option.icon} />} {option.text ? option.text : option}
                                        </div>)
                                    )
                                }
                            </React.Fragment>
                        }
                    </div>
                </div>
            </OutsideClick>
        );
    }

    return (
        <OutsideClick className={props.wrapperClassName} onOutsideClick={() => {setQuery(""); setIsAnimationDisabled(false); setIsDropdownOpen(false);}}>
            <div className={`dropdown dropdown-${props.type} ${props.wrapperClass}`}>
                <div onClick={() => {setIsAnimationDisabled(false); setQuery(""); setIsDropdownOpen(!isDropdownOpen);}} className={`dropdown--button dropdown--button-${props.type} ${props.className}`}>
                    {selectedOptionText} <IonIcon className={`dropdown--button--icon ${props.iconClassName}`} name={isDropdownOpen ? props.openIcon ? props.openIcon : defaultIcons[position].open : props.closedIcon ? props.closedIcon : defaultIcons[position].closed} />
                </div>
                {
                    props.hintText &&
                        <div className={`dropdown--hint dropdown--hint-${hintPosition}`}>
                            {props.hintText}
                        </div>
                }
                <EzAnimate disabled={isAnimationDisabled} transitionName={props.transitionName ? props.transitionName : `animation--dropdown--${position}`}>
                {
                    isDropdownOpen &&
                        <div className={`dropdown--options dropdown--options-${position}`}>
                            {
                                props.searchEnabled &&
                                    <div className="dropdown--options--search">
                                        <IonIcon className="dropdown--options--search--icon" icon="search-outline" />
                                        <input onChange={e => { setIsAnimationDisabled(true); setQuery(e.target.value); }} autoFocus={true} placeholder="Seach" className="dropdown--options--search--input" />
                                    </div>
                            }
                            {
                                options.map(option => 
                                    (<div key={option.key ? option.key : option} onClick={() => onSelect(option.key ? option.key : option)} className={`dropdown--options--item dropdown--options--item-${props.type}`}>
                                        {option.icon && <IonIcon className={`dropdown--options--item--icon`} name={option.icon} />} {option.text ? option.text : option}
                                    </div>)
                                )
                            }
                        </div>
                }
                </EzAnimate>
            </div>
        </OutsideClick>
    );
}
