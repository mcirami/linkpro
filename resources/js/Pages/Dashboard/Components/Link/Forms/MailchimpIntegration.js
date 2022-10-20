import React from 'react';

const MailchimpIntegration = ({connectionError, inputType, editID = false}) => {

    const handleMailchimpClick = (e) => {
        e.preventDefault();
        const url = "/auth/mailchimp";

        if (editID) {
            localStorage.setItem('editID', editID);
        } else {
            localStorage.setItem('showNewForm', true);
        }
        
        localStorage.setItem('inputType', inputType);

        window.location.href = url;
    }

    return (
        <div className="integration_wrap">
            <h3>Mailchimp Integration</h3>
            <p>Connect your Mailchimp account by clicking the button below.</p>
            <small>Note: You will be redirected away from Link Pro to log into Mailchimp.</small>
            <div className="button_wrap">
                <a className="button blue"
                   href="#"
                   onClick={(e) => handleMailchimpClick(e)}
                >
                    Login To Mailchimp
                </a>
            </div>
            <div className="connection_error">
                <p>{connectionError}</p>
            </div>
        </div>
    );
};

export default MailchimpIntegration;
