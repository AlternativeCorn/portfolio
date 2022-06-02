import Joi from "joi";
import { Fragment, HTMLInputTypeAttribute, useCallback, useState } from "react";
import ReactTextareaAutosize from "react-textarea-autosize";


interface ValidatedInputProps {
    value: string | number | readonly string[] | undefined;
    onChange: (value: string) => void;
    validation: Joi.StringSchema;
    placeholder?: string;
    type: HTMLInputTypeAttribute;
    name?: string;
}

interface ValidatedAreaProps extends Omit<ValidatedInputProps, 'type'> {}

/**
 * 
 * Validated TextArea's will give back evalution of the input given by the user through a Joi Schema
 * 
 */
export function ValidatedTextArea({value, onChange, validation, placeholder, name}: ValidatedAreaProps) {

    let [error, setError] = useState<string | undefined>(undefined);

    const HandleChange = useCallback((value: string) => {
        onChange(value);
        if(error) Validate(value); //if there is an error instantly validate so the user knows when their input has been resolved
    }, [error]);

    //function that validates the input given by the user
    const Validate = useCallback((value: string) => {

        //validate the value through the provided JOI schema
        let result = validation.label(name ?? "value").validate(value);

        //if there is an error display it to the user
        if(result.error) {
            setError(result.error.message);
            return;
        }

        //otherwise clear the current displayed error and show a valid input
        setError(undefined);
    }, []);

    return (
        <Fragment>
            <ReactTextareaAutosize 
                name={name}
                value={value}
                placeholder={placeholder}
                className={error ? 'error' : ''}
                onBlur={(e) => Validate(e.target.value)}
                onChange={(e) => HandleChange(e.target.value)}
                minRows={5} />
            {error ? <div style={{color: 'red', fontSize: '.8em', marginBottom: '10px'}}>{error}</div> : <Fragment />}
        </Fragment>
    );
}

/**
 * 
 * Validated Inputs will give back evalution of the input given by the user through a Joi Schema
 * 
 */
export default function ValidatedInput({value, type, onChange, validation, placeholder, name}: ValidatedInputProps) {

    let [error, setError] = useState<string | undefined>(undefined);

    const HandleChange = useCallback((value: string) => {
        onChange(value);
        if(error) Validate(value); //if there is an error instantly validate so the user knows when their input has been resolved
    }, [error]);

    //function that validates the input given by the user
    const Validate = useCallback((value: string) => {

        //validate the value through the provided JOI schema
        let result = validation.label(name ?? "value").validate(value);

        //if there is an error display it to the user
        if(result.error) {
            setError(result.error.message);
            return;
        }

        //otherwise clear the current displayed error and show a valid input
        setError(undefined);
    }, []);
    
    return (
        <Fragment>
            <input 
                type={type}
                placeholder={placeholder}
                className={error ? 'error' : ''}
                value={value}
                onBlur={(e) => Validate(e.target.value)}
                onChange={(e) => HandleChange(e.target.value)}
                name={name}
            />
            {error ? <div style={{color: 'red', fontSize: '.8em', marginBottom: '10px'}}>{error}</div> : <Fragment />}
        </Fragment>
    );
}