import React, {useContext, useState} from 'react';
import FormBreadcrumbs from './FormBreadcrumbs';
import FormTabs from './FormTabs';
import {
    UserLinksContext,
    OriginalArrayContext,
} from '../../../App';

const FormComponents = ({
                            setShowLinkForm,
                            folderID,
                            editID,
                            setEditID,
                            setShowUpgradePopup,
                            setShowMessageAlertPopup,
                            setOptionText,
                            customIconArray,
                            setCustomIconArray,
                            subStatus,
                            radioValue,
                            setRadioValue,
                            redirectedType,
                            connectionError,
                            showLoader,
                            setShowLoader,
                            inputType,
                            setInputType,
                            integrationType,
                            setIntegrationType,
                            shopifyStores,
                            setShopifyStores
}) => {

    const { userLinks, dispatch } = useContext(UserLinksContext);
    const { originalArray, dispatchOrig } = useContext(OriginalArrayContext);

    const [currentLink, setCurrentLink] = useState (
        userLinks.find(function(e) {
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

    return (
        <div className="edit_form link my_row">
            <div className="tab_content_wrap my_row">
                <div className="tabs">
                    <FormTabs
                        radioValue={radioValue}
                        setRadioValue={setRadioValue}
                        subStatus={subStatus}
                        inputType={inputType}
                        setInputType={setInputType}
                        currentLink={currentLink}
                        setCurrentLink={setCurrentLink}
                        handleOnClick={handleOnClick}
                        folderID={folderID}
                        integrationType={integrationType}
                        editID={editID}
                        redirectedType={redirectedType}
                    />
                </div>
            </div>
        </div>
    );
};

export default FormComponents;
