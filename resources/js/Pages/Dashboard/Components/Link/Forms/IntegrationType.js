import React, {useEffect, useRef} from 'react';
import {
    getMailchimpLists,
    getStores,
} from '../../../../../Services/UserService';
import {isEmpty} from 'lodash';
import {
    HandleFocus,
    HandleBlur,
    InputEventListener,
} from '../../../../../Utils/InputAnimations';

const IntegrationType = ({
                             integrationType,
                             setIntegrationType,
                             setShowLoader,
                             setLists,
                             currentLink,
                             redirectedType,
                             setShopifyStores
}) => {

    const myRef = useRef(null);

    useEffect(() => {

        if (integrationType === "mailchimp") {
            //setIntegrationType("mailchimp");
            fetchLists()
        } else if (integrationType === "shopify") {
            //setIntegrationType("shopify")
            fetchStores()
        }

        if(redirectedType) {
            redirectedType === "mailchimp" ?
                fetchLists() :
                fetchStores()
        }

    },[integrationType])

    useEffect(() => {
        InputEventListener(myRef.current);
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
            <select
                className=""
                ref={myRef}
                name="integration_type"
                onChange={(e) => handleChange(e)}
                onFocus={(e) => HandleFocus(e.target)}
                onBlur={(e) => HandleBlur(e.target)}
                value={integrationType || undefined}
            >
                <option value=""></option>
                <option
                    value="mailchimp">
                    MailChimp
                </option>
                <option
                    value="shopify">
                    Shopify
                </option>
            </select>
            <label htmlFor="mailchimp_list_id">Select Integration Type</label>
        </div>
    );
};

export default IntegrationType;
