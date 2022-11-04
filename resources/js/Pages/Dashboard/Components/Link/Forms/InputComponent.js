import React, {useState, useEffect} from 'react';
import {
    removeMailchimpConnection,
} from '../../../../../Services/UserService';
import ShopifyIntegration from './ShopifyIntegration';
import ShopifyProducts from './ShopifyProducts';

const InputComponent = ({
                            currentLink,
                            setCurrentLink,
                            inputType, lists,
                            setLists,
                            allProducts,
                            selectedProducts,
                            setSelectedProducts,
                            displayAllProducts,
                            setDisplayAllProducts
}) => {

    const {url, email, phone} = currentLink;

    const [inputValues, setInputValues] = useState({
        name: null,
        type: null,
        value: null,
        placeholder: null,
        key: null
    })

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
            case 'mailchimp_list':
                setInputValues({
                    name: "mailchimp_list_id",
                    placeholder: "Select Your Mailchimp List",
                    value: "",
                    key: "mailchimp_list_id"
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
        let iconType;

        if (key === "phone") {
            key2 = "email"
            key3 = "url"
            key4 = "mailchimp_list_id"
            iconType = "standard"
        } else if (key.includes("email")) {
            key2 = "phone"
            key3 = "url"
            key4 = "mailchimp_list_id"
            iconType = "standard"
        } else if (key === "mailchimp_list_id") {
            key2 = "email"
            key3 = "url"
            key4 = "phone"
            iconType = "mailchimp"
        } else {
            key2 = "phone"
            key3 = "email"
            key4 = "mailchimp_list_id"
            iconType = "standard"
        }

        setCurrentLink({
            ...currentLink,
            [`${key}`]: e.target.value,
            [`${key2}`]: null,
            [`${key3}`]: null,
            [`${key4}`]: null,
            type: iconType
        })
    }

    const handleClick = (e) => {
        e.preventDefault();

        removeMailchimpConnection().then(
            (data) => {
                if (data.success) {
                    setLists(null);
                    setCurrentLink({
                        ...currentLink,
                        active_status: 0,
                    })
                }
            }
        )
    }

    const {name, type, value, placeholder, key } = inputValues;

    return (

        <>
            {(() => {

                switch (inputType) {

                    case "mailchimp_list":

                        return (
                            <div className="my_row">
                                <label htmlFor="mailchimp_list_id">Mailchimp List</label>
                                <select
                                    name="mailchimp_list_id"
                                    onChange={(e) => handleChange(e, key)}
                                    value={currentLink.mailchimp_list_id ||
                                        undefined}
                                >
                                    <option>Select Your List</option>
                                    {lists?.map((list) => {
                                        return (
                                            <option
                                                key={list.list_id}
                                                value={list.list_id}>{list.list_name}
                                            </option>
                                        )
                                    })}
                                </select>
                                {lists &&
                                    <div className="my_row remove_link">
                                        <a href="#" onClick={(e) => handleClick(
                                            e)}>
                                            Remove Connection
                                        </a>
                                    </div>
                                }
                            </div>
                        )
                    case "shopify":

                        return (
                            <ShopifyProducts
                                selectedProducts={selectedProducts}
                                setSelectedProducts={setSelectedProducts}
                                allProducts={allProducts}
                                displayAllProducts={displayAllProducts}
                                setDisplayAllProducts={setDisplayAllProducts}
                            />
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
        </>

    )
}

export default InputComponent;
