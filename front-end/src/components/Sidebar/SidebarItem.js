import React from 'react';
import { NavLink } from 'react-router-dom';
import { IonIcon } from '../IonIcons/IonIcon';

export const SidebarItem = props => {
    return (
        <div className={`sidebar--item ${props.disabled ? "sidebar--item-disabled" : ""}`}>
            <div className="sidebar--item--background"></div>
                {
                    props.to === "" ? 
                        <div onClick={props.disabled ? null : props.onClick} className={`sidebar--item--icon ${props.active ? "sidebar--item--icon-selected" : ""}`}>
                            <IonIcon className="sidebar--item--icon--icon" name={props.icon} />
                        </div>
                    :
                        <NavLink activeClassName="sidebar--item--icon-selected" to={props.to} className="sidebar--item--icon">
                            <IonIcon className="sidebar--item--icon--icon" name={props.icon} />
                        </NavLink>
                }
            <label className="sidebar--item--label">{props.name}</label>
        </div>
    );
}
