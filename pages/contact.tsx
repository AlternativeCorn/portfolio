import axios from 'axios';
import type { NextPage } from 'next'
import { FormEvent, Fragment, useCallback, useState } from 'react';
import styles from '../styles/Contact.module.scss';
import Joi from 'joi';
import ValidatedInput, { ValidatedTextArea } from '../components/ValidatedInput';

const Contact : NextPage = () => {

    const [success, setSuccess] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [working, setWorking] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    
    //Handles submitting the contact form to API
    const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //make sure we're not already processing a request
        if(working) return; 
        setWorking(true);

        axios.post(`/api/contact`, {
            email,
            name,
            message
        }).then(({data}) => {
            setSuccess(data.success);
        }).catch((error) => {
            setError(error.response.data.error);
        }).finally(() => {
            setWorking(false);
        })
    }, [email,name,message,working]);

    return (
        <div className={styles.contact}>
            <div className={styles.contact_inner}>
                <div className={styles.card}>
                    { 
                    !success ? 
                        <Fragment>
                            <h1>Contact</h1>
                            <p>Want to contact me, or do you have any other inquiries?<br/>Then feel free to contact me through this form, and I&apos;ll get back to you as soon as possible!</p>
                            {error ? <div className='alert error'>{error}</div> : <Fragment />}
                            <form onSubmit={(e) => onSubmit(e)} method="post" action="/api/contact">
                                <label htmlFor="email">Your Email <span className='required'>*</span></label>
                                <ValidatedInput 
                                    validation={Joi.string().email({ tlds: { allow: false }}).required()}
                                    value={email}
                                    onChange={(value) => setEmail(value)}
                                    name="email" 
                                    type="email"
                                    placeholder='yourname@example.com' />
                                <label htmlFor="fullname">Your Name <span className='required'>*</span></label>
                                <ValidatedInput 
                                    validation={Joi.string().required()}
                                    value={name} 
                                    onChange={(value) => setName(value)} 
                                    name="fullname" 
                                    type="text"
                                    placeholder='John Titor'/>
                                <label htmlFor="message">Your Message <span className='required'>*</span></label>
                                <ValidatedTextArea validation={Joi.string().max(9048).required()} value={message} onChange={(value) => setMessage(value)} name="message"/>
                                <div style={{margin: '10px auto'}}><span style={{color: 'red'}}>*</span> Required Field</div>
                                {!working ? <button style={{float: 'right'}}>Send</button> : <Fragment /> }
                            </form>
                        </Fragment>
                    : 
                    <div className='alert success'>Successfully sent your submission!</div>
                }
                </div>
            </div>
        </div>
    );
}

export default Contact;