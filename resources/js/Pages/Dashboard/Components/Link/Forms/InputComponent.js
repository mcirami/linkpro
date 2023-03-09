import React, {useState, useEffect} from 'react';
import AllProducts from './Shopify/AllProducts';
import MailchimpLists from './Mailchimp/MailchimpLists';
import StoreDropdown from './Shopify/StoreDropdown';
import SelectedProducts from './Shopify/SelectedProducts';

const InputComponent = ({
                            currentLink,
                            setCurrentLink,
                            inputType,
                            setInputType,
                            lists,
                            setLists,
                            shopifyStores,
                            setShowAddStore,
                            allProducts,
                            setAllProducts,
                            selectedProducts,
                            setSelectedProducts,
                            displayAllProducts,
                            setDisplayAllProducts,
                            integrationType,
                            setIntegrationType,
                            setShowLoader
}) => {

    const {url, email, phone, mailchimp_list_id, shopify_products} = currentLink;

    const [inputValues, setInputValues] = useState({
        name: null,
        type: null,
        value: null,
        placeholder: null,
        key: null
    })

    /*useEffect(() => {

        let currentInputType;

        if (integrationType === "mailchimp") {
            currentInputType ="mailchimp";
        } else if (integrationType === "shopify") {
            currentInputType = "shopify";
        } else if(url) {
            currentInputType = "url";
        } else if(email) {
            currentInputType = "email";
        } else if(phone) {
            currentInputType = "phone";
        } else if(mailchimp_list_id) {
            currentInputType = "mailchimp";
        } else if(shopify_products) {
            inputType = "shopify";
        } else {
            currentInputType = "url";
        }

        setInputType(currentInputType)
        setCurrentLink((link) => ({
            ...link,
            type:currentInputType
        }));

    },[])*/

    useEffect(() => {

        switch (inputType) {

            case 'url':
                setInputValues({
                    name: "url",
                    type: "text",
                    value: url || "",
                    placeholder: "https://linkurl.com",
                    key: "url"
                })
                break;
            case 'email':
                setInputValues({
                    name: "email",
                    type: "email",
                    value: email || "",
                    placeholder: "example@example.com",
                    key: "email"
                })
                break;
            case 'phone':
                setInputValues({
                    name: "phone",
                    type: "tel",
                    value: phone || "",
                    placeholder: "xxx-xxx-xxxx",
                    key: "phone"
                })
                break;
            case 'mailchimp':
                setInputValues({
                    name: "mailchimp_list_id",
                    placeholder: "Select Your Mailchimp List",
                    value: "",
                    key: "mailchimp_list_id"
                })
                break;
            case 'shopify':
                setInputValues({
                    name: "shopify_products",
                    placeholder: "Select Your Products",
                    value: "",
                    key: "shopify_products"
                })
                break;
            default:
                setInputValues({
                    name: "url",
                    type: "text",
                    value: url || "",
                    placeholder: "https://linkurl.com",
                    key: "url"
                })
                break;
        }


    }, [inputType, currentLink]);

    const handleChange = (e, key) => {

        let key2;
        let key3;
        let key4;
        let key5;
        let iconType;

        //based on what is being submitted, set the key for current link, all other keys need to be null.
        // ***Key must match Database Column name***

        if (key === "phone") {
            key2 = "email"
            key3 = "url"
            key4 = "mailchimp_list_id"
            key5 = "shopify_products"
            iconType = "standard"
        } else if (key.includes("email")) {
            key2 = "phone"
            key3 = "url"
            key4 = "mailchimp_list_id"
            key5 = "shopify_products"
            iconType = "standard"
        } else if (key === "mailchimp_list_id") {
            key2 = "email"
            key3 = "url"
            key4 = "phone"
            key5 = "shopify_products"
            iconType = "mailchimp"
        } else if (key === "shopify_products") {
            key2 = "email"
            key3 = "url"
            key4 = "phone"
            key5 = "mailchimp_list_id"
            iconType = "shopify"
        } else {
            key2 = "phone"
            key3 = "email"
            key4 = "mailchimp_list_id"
            key5 = "shopify_products"
            iconType = "standard"
        }

        setCurrentLink({
            ...currentLink,
            [`${key}`]: e.target?.value || e,
            [`${key2}`]: null,
            [`${key3}`]: null,
            [`${key4}`]: null,
            [`${key5}`]: null,
            type: iconType
        })
    }

    const {name, type, value, placeholder, key } = inputValues;

    return (

        <div className="my_row">
            {(() => {

                switch (inputType) {

                    case "mailchimp":

                        return (
                            <MailchimpLists
                                handleChange={handleChange}
                                lists={lists}
                                setLists={setLists}
                                currentLink={currentLink}
                                setCurrentLink={setCurrentLink}
                                inputKey={key}
                                setInputType={setInputType}
                                setIntegrationType={setIntegrationType}
                            />
                        )

                    case "shopify":

                        return (
                            <div className="my_row products_wrap">
                                {displayAllProducts ?
                                        <AllProducts
                                            selectedProducts={selectedProducts}
                                            setSelectedProducts={setSelectedProducts}
                                            allProducts={allProducts}
                                            setDisplayAllProducts={setDisplayAllProducts}
                                            handleChange={handleChange}
                                            setCurrentLink={setCurrentLink}
                                            inputKey={key}
                                            name={name}
                                        />

                                        :
                                    <>
                                        <StoreDropdown
                                            currentLink={currentLink}
                                            setCurrentLink={setCurrentLink}
                                            setSelectedProducts={setSelectedProducts}
                                            setShowAddStore={setShowAddStore}
                                            shopifyStores={shopifyStores}

                                        />
                                        <SelectedProducts
                                            currentLink={currentLink}
                                            setDisplayAllProducts={setDisplayAllProducts}
                                            setAllProducts={setAllProducts}
                                            setShowLoader={setShowLoader}
                                        />
                                    </>
                                }
                            </div>
                        )

                    case "affiliate" :

                        return (
                            <div className="my_row external_link">
                                <h3>Offer Landing Page:</h3>
                                <a href={url.split("?")[0]} target="_blank">{url.split("?")[0]}</a>
                            </div>
                        )

                    default:

                        return (

                            <input
                                name={name}
                                type={type}
                                defaultValue={value || ""}
                                placeholder={placeholder}
                                onChange={(e) => handleChange(e, key)}
                            />
                        )
                }

            })()}
        </div>

    )
}

export default InputComponent;
