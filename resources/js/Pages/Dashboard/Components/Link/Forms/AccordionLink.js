import React from 'react';

const AccordionLink = ({type, setRadioValue, linkText}) => {

    const handleClick = (e) => {
        e.preventDefault();
        setRadioValue(type);
    }

    return (

        <div className="radio_input_wrap">
            <a href="#" onClick={(e) => handleClick(e)}>
                {linkText}
            </a>
            {/*<input id="standard_radio" type="radio" value="standard" name="icon_type"
                   checked={radioValue ===
                       "standard"}
                   onChange={(e) => {
                       handleOnChange(
                           e)
                   }}/>*/}
        </div>

    );
};

export default AccordionLink;
