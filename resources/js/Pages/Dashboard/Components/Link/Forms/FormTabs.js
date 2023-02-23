import React, {useEffect} from 'react';

const FormTabs = ({
                      radioValue,
                      setRadioValue,
                      subStatus,
                      inputType,
                      setInputType,
                      currentLink,
                      setCurrentLink,
                      handleOnClick,
                      folderID,
                      integrationType,
                      editID,
                      redirectedType
}) => {

    useEffect(() => {

        if(!redirectedType) {
            if (currentLink.mailchimp_list_id || currentLink.shopify_products) {
                setRadioValue("integration")
            } else if ((currentLink.email || currentLink.url ||
                    currentLink.phone) &&
                currentLink.icon?.includes("custom-icon")) {
                setRadioValue("custom")
            } else {
                setRadioValue("standard")
            }
        }

    },[])

    const handleOnChange = (e) => {
        const value = e.target.value;

        setRadioValue(value);

        if (value === "integration") {

            if (integrationType === "mailchimp") {
                setInputType('mailchimp')
            }

            if (integrationType === "shopify") {
                setInputType('shopify')
            }

            const values = editID ?
                {type: integrationType === "mailchimp" ? "mailchimp" : "shopify"}
            :
                {
                    icon: integrationType === "mailchimp" ?
                        'https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Mailchimp.png' :
                        'https://local-lp-user-images.s3.us-east-2.amazonaws.com/icons/Shopify.png',
                    type: integrationType === "mailchimp" ?
                        "mailchimp" :
                        "shopify"
                }

            setCurrentLink(prevState => ({
                ...prevState,
                values
            }))

        } else {

            if(inputType !== "mailchimp" && inputType !== "shopify") {
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
        <div className={ !folderID ? "my_row radios_wrap" : "my_row radios_wrap two_col" }>
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
            {!folderID &&
                <div className={radioValue === "integration" ?
                    "radio_wrap active" :
                    "radio_wrap"}>
                    <label htmlFor="integration">
                        <div className="radio_input_wrap">
                            <input id="integration" type="radio" value="integration" name="icon_type"
                                   onChange={(e) => {
                                       handleOnChange(e)
                                   }}
                                   disabled={!subStatus}
                                   checked={radioValue === "integration"}
                            />
                        </div>
                        Integrations
                    </label>
                    {!subStatus &&
                        <span className="disabled_wrap" data-type="integration" onClick={(e) => handleOnClick(
                            e)}/>
                    }
                </div>
            }
            <div className={radioValue === "affiliate" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="affiliate_radio">
                    <div className="radio_input_wrap">
                        <input id="affiliate_radio" type="radio" value="affiliate" name="icon_type"
                               checked={radioValue === "affiliate"}
                               onChange={(e) => {handleOnChange(e) }}/>
                    </div>
                    Affiliate Offers
                </label>
            </div>
        </div>
    );
};

export default FormTabs;
