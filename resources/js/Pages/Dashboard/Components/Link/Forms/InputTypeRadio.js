import React, {useEffect} from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';

const InputTypeRadio = ({inputType, setInputType, currentLink, setCurrentLink}) => {

    useEffect(() => {
        if (currentLink.url) {
            setInputType("url")
        } else if (currentLink.email) {
            setInputType("email")
        } else if (currentLink.phone) {
            setInputType("phone")
        }
    }, [])

     const handleOnChange = (e) => {
         setInputType(e.target.value)
         setCurrentLink(prevState => ({
             ...prevState,
             type: e.target.value
         }))
     }

    return (
        <div className="my_row radios_wrap input_types">

            <RadioGroup
                row
                aria-labelledby="input_type_radio_button_group"
                name="input_type"
                value={inputType}
                onChange={handleOnChange}
            >
                <FormControlLabel
                    value="url"
                    sx={{
                        '.css-ahj2mt-MuiTypography-root' : {
                            fontFamily: "opensanssemibold",
                        }
                    }}
                    control={
                    <Radio
                        sx={{
                            '&.Mui-checked': {
                                color: '#424fcf',
                            },
                            '&.MuiRadio-root' : {
                                padding: '5px'
                            }
                        }}
                    />
                } label="URL" />
                <FormControlLabel
                    value="email"
                    sx={{
                        '.css-ahj2mt-MuiTypography-root' : {
                            fontFamily: "opensanssemibold",
                        }
                    }}
                    control={
                    <Radio
                        sx={{
                            '&.Mui-checked': {
                                color: '#424fcf',
                            },
                            '&.MuiRadio-root' : {
                                padding: '5px'
                            }
                        }}
                    />
                } label="Email" />
                <FormControlLabel
                    value="phone"
                    sx={{
                        '.css-ahj2mt-MuiTypography-root' : {
                            fontFamily: "opensanssemibold",
                        }
                    }}
                    control={
                    <Radio
                        sx={{
                            '&.Mui-checked': {
                                color: '#424fcf',
                            },
                            '&.MuiRadio-root' : {
                                padding: '5px'
                            }
                        }}
                    />
                } label="Phone" />
            </RadioGroup>

            {/*<div className={inputType === "url" || !inputType ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="url">
                    <input id="url"
                           type="radio"
                           value="url"
                           name="input_type"
                           checked={inputType === "url" || !inputType}
                           onChange={(e) => {handleOnChange(e) }}/>
                    URL
                </label>
            </div>
            <div className={inputType === "email" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="email">
                    <input id="email"
                           type="radio"
                           value="email"
                           name="input_type"
                           onChange={(e) => { handleOnChange(e) }}
                           checked={inputType === "email"}
                    />
                    Email
                </label>
            </div>
            <div className={inputType === "phone" ? "radio_wrap active" : "radio_wrap" }>
                <label htmlFor="phone">
                    <input id="phone"
                           type="radio"
                           value="phone"
                           name="input_type"
                           onChange={(e) => { handleOnChange(e) }}
                           checked={inputType === "phone"}
                    />
                    Phone
                </label>
            </div>*/}
        </div>
    );
};

export default InputTypeRadio;
