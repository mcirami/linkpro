import React, {useContext, useState} from 'react';
import StandardForm from './StandardForm';
import {
    FolderLinksContext,
    OriginalArrayContext,
    OriginalFolderLinksContext,
    PageContext,
    UserLinksContext,
} from '../../../App';
import {UpgradePopup} from '../../Popups/UpgradePopup';

const LinkFormNew = ({
                         radioValue,
                         setRadioValue,
                         inputType,
                         setInputType,
                         editID,
                         subStatus,
                         setShowLinkForm,
                         setEditID,
                         setShowUpgradePopup,
                         setOptionText
}) => {

    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { originalArray, dispatchOrig } = useContext(OriginalArrayContext);
    const { folderLinks, dispatchFolderLinks } = useContext(FolderLinksContext);
    const { originalFolderLinks, dispatchOrigFolderLinks } = useContext(OriginalFolderLinksContext);
    const  { pageSettings } = useContext(PageContext);

    const [currentLink, setCurrentLink] = useState(
        userLinks.find(function(e) {
            return e.id === editID
        }) || folderLinks.find(function(e) {
            return e.id === editID
        }) ||
        {
            icon: null,
            name: null,
            url: null,
            email: null,
            phone: null,
            mailchimp_list_id: null,
            shopify_products: null,
            shopify_id: null,
            type: null,
        }
    );

    const handleOnChange = (e) => {
        const value = e.target.value;

        setRadioValue(value);

        /*if (value === "integration") {

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
        }*/
    }

    return (
        <div className={"my_row radios_wrap"}>
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

            {radioValue === "standard" &&
                <div className={`inner_wrap ${radioValue === "standard" && "open"}`}>

                    <StandardForm
                        radioValue={radioValue}
                        currentLink={currentLink}
                        setCurrentLink={setCurrentLink}
                        inputType={inputType}
                        setInputType={setInputType}
                        editID={editID}
                        subStatus={subStatus}
                        setShowLinkForm={setShowLinkForm}
                        setEditID={setEditID}
                        setShowUpgradePopup={setShowUpgradePopup}
                        setOptionText={setOptionText}
                    />

                </div>
            }
        </div>

    );
};

export default LinkFormNew;
