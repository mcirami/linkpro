import React from 'react';

const FormTabs = ({
                      radioValue,
                      setRadioValue,
                      subStatus,
                      inputType,
                      setInputType,
                      setCurrentLink,
                      handleOnClick,
}) => {

    const handleOnChange = (e) => {
        const value = e.target.value;
        setRadioValue(value);

        if (value === "integration") {

            setInputType('mailchimp_list')

            setCurrentLink(prevState => ({
                ...prevState,
                icon: 'https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png',
            }))
        } else {
            if(inputType !== "mailchimp_list") {
                setInputType(inputType)
            } else {
                setInputType("url")
            }
        }
    }

    return (
        <div className="my_row radios_wrap">
            <div className={radioValue === "standard" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="standard_radio">
                    <input id="standard_radio" type="radio" value="standard" name="icon_type"
                           checked={radioValue === "standard"}
                           onChange={(e) => {handleOnChange(e) }}/>
                    Standard Icons
                </label>
            </div>
            <div className={radioValue === "custom" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="custom_radio">
                    <input id="custom_radio" type="radio" value="custom" name="icon_type"
                           onChange={(e) => { handleOnChange(e) }}
                           disabled={!subStatus}
                           checked={radioValue === "custom"}
                    />
                    Custom Icons
                </label>
                {!subStatus && <span className="disabled_wrap" data-type="custom" onClick={(e) => handleOnClick(e)} />}
            </div>
            <div className={radioValue === "integration" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="integration">
                    <input id="integration" type="radio" value="integration" name="icon_type"
                           onChange={(e) => { handleOnChange(e) }}
                           disabled={!subStatus}
                           checked={radioValue === "integration"}
                    />
                    Integrations
                </label>
                {!subStatus && <span className="disabled_wrap" data-type="integration" onClick={(e) => handleOnClick(e)} />}
            </div>
        </div>
    );
};

export default FormTabs;
