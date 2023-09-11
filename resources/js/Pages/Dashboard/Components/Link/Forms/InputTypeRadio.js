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
        </div>
    );
};

export default InputTypeRadio;
