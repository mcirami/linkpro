import React from 'react';

const FormTabs = ({
                      radioValue,
                      setRadioValue,
                      subStatus,
                      inputType,
                      setInputType,
                      setCurrentLink,
                      handleOnClick,
                      folderID
}) => {

    const handleOnChange = (e) => {
        const value = e.target.value;

        setRadioValue(value);

        if (value === "integration") {

            setInputType('mailchimp')

            setCurrentLink(prevState => ({
                ...prevState,
                icon: 'https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png',
                type: "mailchimp"
            }))
        } else {
            if(inputType !== "mailchimp") {
                setInputType(inputType)
                setCurrentLink(prevState => ({
                    ...prevState,
                    type: "standard"
                }))
            } else {
                setInputType("url")
                setCurrentLink(prevState => ({
                    ...prevState,
                    type: "standard"
                }))
            }
        }
    }

    return (
        <div className="my_row radios_wrap">
            <div className={radioValue === "standard" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="standard_radio">
                    <div className="radio_input_wrap">
                        <input id="standard_radio" type="radio" value="standard" name="icon_type"
                               checked={radioValue === "standard"}
                               onChange={(e) => {handleOnChange(e) }}/>
                    </div>
                        Standard Icons
                </label>
            </div>
            <div className={radioValue === "custom" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="custom_radio">
                    <div className="radio_input_wrap">
                        <input id="custom_radio" type="radio" value="custom" name="icon_type"
                               onChange={(e) => { handleOnChange(e) }}
                               disabled={!subStatus}
                               checked={radioValue === "custom"}
                        />
                    </div>
                    Custom Icons
                </label>
                {!subStatus && <span className="disabled_wrap" data-type="custom" onClick={(e) => handleOnClick(e)} />}
            </div>
            <div className={radioValue === "integration" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="integration">
                    <div className="radio_input_wrap">
                        <input id="integration" type="radio" value="integration" name="icon_type"
                               onChange={(e) => { handleOnChange(e) }}
                               disabled={!subStatus || folderID}
                               checked={radioValue === "integration"}
                        />
                    </div>
                    Integrations
                </label>
                { !subStatus || folderID ? <span className="disabled_wrap" data-type="integration" onClick={(e) => handleOnClick(e)} /> : ""}
            </div>
        </div>
    );
};

export default FormTabs;
