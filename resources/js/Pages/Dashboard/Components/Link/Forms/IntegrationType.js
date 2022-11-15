import React, {useEffect} from 'react';
import {
    getAllProducts,
    getMailchimpLists,
} from '../../../../../Services/UserService';
import {isEmpty} from 'lodash';

const IntegrationType = ({
                             integrationType,
                             setIntegrationType,
                             setInputType,
                             setShowLoader,
                             setLists,
                             setAllProducts,
                             currentLink,
                             redirectedType,
                             inputType
}) => {

    useEffect(() => {

        if (currentLink.mailchimp_list_id) {
            setIntegrationType("mailchimp");
            setInputType("mailchimp")
            fetchLists()
        } else if (currentLink.shopify_products){
            setIntegrationType("shopify")
            setInputType("shopify")
            fetchProducts()
        }

        if (redirectedType) {
            redirectedType === "mailchimp" ?
                fetchLists() :
                fetchProducts()
        }

    },[])

    const handleChange = (e) => {
        const value = e.target.value;

        setInputType(value)
        setIntegrationType(value);

        if(value === "mailchimp") {
            fetchLists()
        } else if (value === "shopify") {
            fetchProducts()
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

    const fetchProducts = () => {

        setShowLoader({show: true, icon: "loading", position: "absolute"});

        getAllProducts().then(
            (data) => {
                if (data.success) {
                    !isEmpty(data.products) && setAllProducts(data.products);
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
