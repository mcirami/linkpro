import React, {useState, useEffect} from 'react';

const InputComponent = ({ currentLink, setCurrentLink, inputType }) => {

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


    }, [currentLink])

    const handleChange = (e, key) => {

        let key2;
        let key3;

        if (key === "phone") {
            key2 = "email"
            key3 = "url"
        } else if (key.includes("email")) {
            key2 = "phone"
            key3 = "url"
        } else {
            key2 = "phone"
            key3 = "email"
        }

        setCurrentLink({
            ...currentLink,
            [`${key}`] : e.target.value,
            [`${key2}`] : null,
            [`${key3}`] : null,
        })
    }

    const {name, type, value, placeholder, key } = inputValues;

    return (

        <>
            <input
                name={name}
                type={type}
                defaultValue={ value || ""}
                placeholder={placeholder}
                onChange={(e) => handleChange(e, key) }
            />
        </>
    )
}

export default InputComponent;
