import React, {useEffect} from 'react';
import {
    getAllProducts,
    getMailchimpLists, getStores,
} from '../../../../../Services/UserService';
import {isEmpty} from 'lodash';

const IntegrationType = ({
                             integrationType,
                             setIntegrationType,
                             setShowLoader,
                             setLists,
                             currentLink,
                             redirectedType,
                             setShopifyStores
}) => {

    useEffect(() => {

        if (currentLink.mailchimp_list_id) {
            setIntegrationType("mailchimp");
            fetchLists()
        } else if (currentLink.shopify_products){
            setIntegrationType("shopify")
            fetchStores()
        }

        if(redirectedType) {
            redirectedType === "mailchimp" ?
                fetchLists() :
                fetchStores()
        }


    },[])

    const handleChange = (e) => {
        const value = e.target.value;

        setIntegrationType(value);

        if(value === "mailchimp") {
            fetchLists()
        }

        if(value === "shopify") {
            fetchStores()
        }
    }

    const fetchLists = () => {

        setShowLoader({show: true, icon: "loading", position: "absolute"});

        getMailchimpLists().then(
            (data) => {
                if (data.success) {
                    !isEmpty(data.lists) && setLists(data.lists);
                    setShowLoader({show: false, icon: "", position: ""});
                }
            }
        )
    }

    const fetchStores = () => {

        setShowLoader({show: true, icon: "loading", position: "absolute"});

        getStores().then(
            (data) => {
                if (data.success) {
                    !isEmpty(data.stores) && setShopifyStores(data.stores)
                    setShowLoader({show: false, icon: "", position: ""});
                }
            }
        )
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
