import React, {useState} from 'react';
import {SubmitContactForm} from '../../Services/ContactRequests';
import {BiMailSend} from 'react-icons/bi';

const ContactForm = () => {

    const [values, setValues] = useState({
        name: "",
        email: "",
        reason: "",
        message: ""
    })

    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const emptyValue = checkForEmptyValues();

        const packets = {
            name: values.name,
            email: values.email,
            reason: values.reason,
            message: values.message,
        }

        if (!emptyValue) {
            SubmitContactForm(packets).then(
                (response) => {
                    if (response.success) {
                        setSubmitted(true);
                    }
                }
            )
        }
    }

    const handleChange = (e, key) => {
        setValues({
            ...values,
            [key]: e.target.value
        })
    }

    const checkForEmptyValues = () => {
        for (var key in values) {
            if(values[key] === "") {
                return true;
            }
        }

        return false
    }

    return (
        <>
        {!submitted ?
            <>
                <div className="row">
                    <div className="col-sm-10 mx-auto">
                        <p className="form_text">Got questions? Need Support? Want to inquire about business opportunities? Send us a message and we'll respond as soon as possible</p>
                    </div>
                </div>
                <form id="contact_form" onSubmit={handleSubmit}>
                    <div className="form-group row">
                        <div className="col-sm-10 mx-auto position-relative">
                            <input
                                className="form-control"
                                type="text"
                                name="name"
                                defaultValue={values.name}
                                onChange={(e) => handleChange(e, "name")}
                            />
                            <label htmlFor="name">Name</label>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-10 mx-auto position-relative">
                            <input
                                className="form-control"
                                type="email"
                                name="email"
                                defaultValue={values.email}
                                onChange={(e) => handleChange(e, "email")}
                            />
                            <label htmlFor="email">E-mail Address</label>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-10 mx-auto position-relative">
                            <select
                                name="reason"
                                id="reason"
                                onChange={(e) => handleChange(e, "reason")}
                                defaultValue="general"
                            >
                                <option value="general">General</option>
                                <option value="support">Account Support</option>
                                <option value="business">Business Inquiries</option>
                            </select>
                            <label htmlFor="reason">Reason For Contact</label>
                        </div>
                    </div>
                    <div className="form-group row">
                        <div className="col-sm-10 mx-auto position-relative">
                            <textarea
                                name="message"
                                rows="10"
                                defaultValue={values.message}
                                onChange={(e) => handleChange(e, "message")}
                            >
                            </textarea>
                            <label htmlFor="message">Message</label>
                        </div>
                    </div>

                    <div className="form-group row">
                        <div className="col-sm-10 mx-auto">
                            <button className="button blue" type="submit">
                                Submit
                            </button>
                        </div>
                    </div>
                </form>
            </>

            :

            <div className="success_message">
                <BiMailSend />
                <h3>Your Inquiry Has Been Sent.</h3>
                <p>We will get back to you soon!</p>
            </div>
        }
        </>
    );
};

export default ContactForm;
