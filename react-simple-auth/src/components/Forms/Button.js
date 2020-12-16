import React from 'react';

export const Button = React.forwardRef((props, ref) => {
    if (props.hintText)
        return (
            <div id={props.id ? props.id : null} onAnimationEnd={props.onAnimationEnd ? props.onAnimationEnd : null} ref={ref} className={`btn--wrapper ${props.wrapperClassName}`}>
                <div style={{position: props.hintText ? "relative" : null}} onClick={props.disabled ? null : props.onClick} className={`btn ${props.disabled ? "btn-disabled" : ""} ${props.disableDefaultStyle ? "btn-no_style" : `btn-${props.type}`} ${props.className}`}>
                    {props.children}
                    {
                        props.hintText && !props.disabled &&
                            <div className={`dropdown--hint dropdown--hint-${props.hintPosition ? props.hintPosition : "bottom"}`}>
                                {props.hintText}
                            </div>
                    }
                </div>
            </div>
        );
    return (
        <div id={props.id ? props.id : null} onAnimationEnd={props.onAnimationEnd ? props.onAnimationEnd : null} ref={ref} onClick={props.disabled ? null : props.onClick} className={`btn ${props.disabled ? "btn-disabled" : ""} ${props.disableDefaultStyle ? "btn-no_style" : `btn-${props.type}`} ${props.className}`}>
            {props.children}
        </div>
    );
});