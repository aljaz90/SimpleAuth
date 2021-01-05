import React, { useState } from 'react';
import { IonIcon } from '../IonIcons/IonIcon';
import { Button } from './Button';
import { Checkbox } from './Checkbox';
import { Dropdown } from './Dropdown';
import { Switch } from './Switch';

export const EFormType = {
    DEFAULT: "default",
    NO_SUBMIT: "no_submit"
};

export const Form = props => {

    const initialiseValues = () => {
        let values = {};
        for (let i = 0; i<props.rows.length; i++) {
            for (let j = 0; j<props.rows[i].length; j++) {
                let input = props.rows[i][j];
                values[input.key] = input.defaultValue ? input.defaultValue : "";
            }
        }
        return values;
    };

    const getFormType = () => {
        let type = EFormType.DEFAULT;
        if (props.type === EFormType.NO_SUBMIT) {
            type = EFormType.NO_SUBMIT;
        }
        return type;
    };

    const [values, setValues] = useState(() => initialiseValues());
    const [showingPasswords, setShowingPasswords] = useState([]);
    const [formType] = useState(getFormType());

    const submitForm = () => {
        props.onSubmit(values);
    };

    const toggleShowPassword = key => {
        if (showingPasswords.includes(key)) {
            let newShowingPasswords = [...showingPasswords.filter(el => el !== key)];
            setShowingPasswords(newShowingPasswords);
        }
        else {
            let newShowingPasswords = [...showingPasswords, key];
            setShowingPasswords(newShowingPasswords);
        }
    };

    const onChange = (key, value) => {
        setValues({...values, [key]: value});

        if (formType === EFormType.NO_SUBMIT) {
            props.onChange(key, value)
        }
    };

    return (
        <div className={`form ${props.className}`}>
            {
                props.title &&
                    <div className="form--title">
                        {
                            props.title.icon &&
                                <IonIcon className="form--title--title" icon={props.title.icon} />
                        }
                        {props.title.text}
                    </div>

            }
            {
                props.rows.map((row, i) => 
                    <div key={i} className="form--row">
                        {
                            row.map(input => {
                                if (input.type === "textarea") {
                                    return (
                                        <div key={input.key} style={{flexGrow: input.fullWidth ? "1" : null}} className="form--row--input_group">
                                            <textarea value={values[input.key]} className="form--row--input_group--input form--row--input_group--input-textarea" id={input.key} type={input.type ? input.type : "text"} onChange={e => onChange(input.key, e.target.value)} />
                                            <label className="form--row--input_group--label" htmlFor={input.key}>{input.text}</label>
                                        </div>
                                    );
                                }
                                else if (input.type === "switch") {
                                    return (
                                        <div key={input.key} className="form--row--input_group">
                                            <Switch className="form--row--input_group--input-switch" defaultOption={input.defaultValue} options={input.options} onSelect={seletedItem => onChange(input.key, seletedItem)} />
                                            <label className="form--row--input_group--label">{input.text}</label>
                                        </div>
                                    );
                                }
                                else if (input.type === "dropdown") {
                                    return (
                                        <div key={input.key} className="form--row--input_group">
                                            <Dropdown wrapperclassName="form--row--input_group--input-dropdown--wrapper" className="form--row--input_group--input form--row--input_group--input-dropdown" options={input.options} onSelect={seletedItem => onChange(input.key, seletedItem)}>
                                                {input.text}
                                            </Dropdown>
                                            <label className="form--row--input_group--label">{input.text}</label>
                                        </div>
                                    );
                                }
                                else if (input.type === "cssdropdown") {
                                    let btnText = input.text;
                                    if (values[input.key]) {
                                        if (input.options[0].key !== null) {
                                            btnText = input.options.find(el => el.key === values[input.key]).text;
                                        }
                                        else {
                                            btnText = values[input.key];
                                        }
                                    }

                                    return (
                                        <div key={input.key} className="form--row--input_group">
                                            <div className="form--row--input_group--input-dropdown">
                                                <div className="form--row--input_group--input-dropdown--options">
                                                    {
                                                        input.options.map(option => 
                                                            <div key={option.key ? option.key : option} onClick={() => onChange(input.key, option.key ? option.key : option)} className="form--row--input_group--input-dropdown--options--item">
                                                                {option.icon && <IonIcon className={`form--row--input_group--input-dropdown--options--item--icon`} name={option.icon} />} {option.text ? option.text : option}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                {btnText} <IonIcon name="chevron-down-outline" />
                                            </div>
                                            <label className="form--row--input_group--label">{input.text}</label>
                                        </div>
                                    );
                                }
                                else if (input.type === "password") {
                                    return (
                                        <div key={input.key} style={{flexGrow: input.fullWidth ? "1" : null}} className="form--row--input_group">
                                            <input className="form--row--input_group--input form--row--input_group--input-password" id={input.key} type={showingPasswords.includes(input.key) ? "text" : "password"} value={values[input.key]} onChange={e => onChange(input.key, e.target.value)} />
                                            <label className="form--row--input_group--label" htmlFor={input.key}>{input.text}</label>
                                            <Button onClick={() => toggleShowPassword(input.key)} className="form--row--input_group--show_password--button" wrapperClassName="form--row--input_group--show_password" disableDefaultStyle={true} hintText={`${showingPasswords.includes(input.key) ? "Hide" : "Show"} ${input.text.toLowerCase()}`}>
                                                <IonIcon className="form--row--input_group--show_password--icon" name={showingPasswords.includes(input.key) ? "eye-off-outline" : "eye-outline"} />
                                            </Button>
                                        </div>
                                    );
                                }
                                else if (input.type === "checkbox") {
                                    return (
                                        <div key={input.key} style={{flexGrow: input.fullWidth ? "1" : null}} className="form--row--input_group form--row--input_group-checkbox">
                                            <label className="form--row--input_group--label form--row--input_group--label-checkbox" htmlFor={input.key}>{input.text}</label>
                                            <Checkbox className="form--row--input_group--input-checkbox" id={input.key} defaultValue={values[input.key]} onSelect={state => onChange(input.key, state)} />
                                        </div>
                                    );
                                }
                                return (
                                    <div key={input.key} style={{flexGrow: input.fullWidth ? "1" : null}} className="form--row--input_group">
                                        <input className="form--row--input_group--input" id={input.key} type={input.type ? input.type : "text"} value={values[input.key]} onChange={e => onChange(input.key, e.target.value)} />
                                        <label className="form--row--input_group--label" htmlFor={input.key}>{input.text}</label>
                                    </div>
                                );
                            })
                        }
                    </div>
                )
            }
            {
                formType !== EFormType.NO_SUBMIT && 
                    <Button onClick={() => submitForm()} className="form--submit">
                        {props.submitText ? props.submitText : "Submit"}
                    </Button>
            }
        </div>
    )
}
