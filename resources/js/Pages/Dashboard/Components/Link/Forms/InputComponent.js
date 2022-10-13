import React, {useState, useEffect} from 'react';

const InputComponent = ({ currentLink, setCurrentLink, inputType }) => {

    const {url, email, phone, embed_code} = currentLink;

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
            case 'textarea':
                setInputValues({
                    name: "embed_code",
                    value: embed_code || "",
                    placeholder: "Paste in your Mailchimp Embedded Form Code",
                    key: "embed_code"
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


    }, [inputType])

    const handleChange = (e, key) => {

        let key2;
        let key3;
        let key4;

        if (key === "phone") {
            key2 = "email"
            key3 = "url"
            key4 = "embed_code"
        } else if (key.includes("email")) {
            key2 = "phone"
            key3 = "url"
            key4 = "embed_code"
        } else if (key === "embed_code") {
            key2 = "email"
            key3 = "url"
            key4 = "phone"
        } else {
            key2 = "phone"
            key3 = "email"
            key4 = "embed_code"
        }

        setCurrentLink({
            ...currentLink,
            [`${key}`] : e.target.value,
            [`${key2}`] : null,
            [`${key3}`] : null,
            [`${key4}`] : null,
        })
    }

    const {name, type, value, placeholder, key } = inputValues;

    return (

        <>
            {inputType === "textarea" ?

                <textarea
                    name={name}
                    id={name}
                    defaultValue={embed_code}
                    rows="20"
                    placeholder={placeholder}
                    onChange={(e) => handleChange(e, key) }
                ></textarea>
                :
                <>
                    <input
                        name={name}
                        type={type}
                        defaultValue={ value || ""}
                        placeholder={placeholder}
                        onChange={(e) => handleChange(e, key) }
                    />
                </>
            }
        </>

    )
}

export default InputComponent;
