import React from 'react';

const IntegrationType = ({integrationType, setIntegrationType, setInputType}) => {

    const handleChange = (e) => {
        const value = e.target.value;

        if (value === "mailchimp") {
            setInputType("mailchimp_list")
        }

        if (value === "shopify") {
            setInputType("shopify")
        }

        setIntegrationType(value);
    }

    return (
        <div className="integration_dropdown_wrap">
            <label htmlFor="mailchimp_list_id">Select Integration Type</label>
            <select
                name="integration_type"
                onChange={(e) => handleChange(e)}
                value={integrationType || undefined}
            >
                <option>Select Integration</option>
                <option
                    value="mailchimp">
                    MailChimp
                </option>
                <option
                    value="shopify">
                    Shopify
                </option>
            </select>
        </div>
    );
};

export default IntegrationType;
