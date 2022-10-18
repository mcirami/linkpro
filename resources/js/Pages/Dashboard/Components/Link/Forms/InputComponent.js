import React, {useState, useEffect} from 'react';
import {getMailchimpLists} from '../../../../../Services/UserService';

const InputComponent = ({ currentLink, setCurrentLink, inputType, lists, setLists }) => {

    const {url, email, phone} = currentLink;

    const [inputValues, setInputValues] = useState({
        name: null,
        type: null,
        value: null,
        placeholder: null,
        key: null
    })

    useEffect(() => {
        if (inputType === "mailchimp_list") {
            fetchLists()
        }
    }, [inputType]);

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

        if (key === "phone") {
            key2 = "email"
            key3 = "url"
            key4 = "mailchimp_list_id"
        } else if (key.includes("email")) {
            key2 = "phone"
            key3 = "url"
            key4 = "mailchimp_list_id"
        } else if (key === "mailchimp_list_id") {
            key2 = "email"
            key3 = "url"
            key4 = "phone"
        } else {
            key2 = "phone"
            key3 = "email"
            key4 = "mailchimp_list_id"
        }

        setCurrentLink({
            ...currentLink,
            [`${key}`]: e.target.value,
            [`${key2}`]: null,
            [`${key3}`]: null,
            [`${key4}`]: null,
        })
    }

    const fetchLists = () => {

        getMailchimpLists().then(
            (data) => {
                if (data.success) {
                    setLists(data.lists)
                }
            }
        )
    }

    const {name, type, value, placeholder, key } = inputValues;

    return (

        <>
            {
                inputType === "mailchimp_list" ?

                    <div className="my_row">
                        <label htmlFor="mailchimp_list_id">Mailchimp List</label>
                        <select
                            name="mailchimp_list_id"
                            onChange={(e) => handleChange(e, key)}
                            value={currentLink.mailchimp_list_id}
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
                    </div>
                :

                <input
                    name={name}
                    type={type}
                    defaultValue={ value || ""}
                    placeholder={placeholder}
                    onChange={(e) => handleChange(e, key) }
                />

            }
        </>

    )
}

export default InputComponent;
