import React, {useEffect, useState} from 'react';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import NumberFormat from 'react-currency-format';
import validator from 'validator/es';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {
    updateData,
    updateSectionData,
} from '../../../Services/CourseRequests';
import {LP_ACTIONS, OFFER_ACTIONS} from '../Reducer';
import {updateOfferData} from '../../../Services/OfferRequests';

const InputComponent = ({
                            placeholder,
                            type,
                            maxChar = null,
                            hoverText,
                            elementName,
                            value,
                            courseData = null,
                            offerData = null,
                            dispatch = null,
                            dispatchOffer = null,
                            sections = null,
                            setSections = null,
                            currentSection = null,
}) => {

    const [charactersLeft, setCharactersLeft] = useState(maxChar);
    const [isValid, setIsValid] = useState(false)

    useEffect(() => {
        if(maxChar) {
            if (value) {
                setCharactersLeft(maxChar - value.length);
                if (maxChar - value.length >= 0) {
                    setIsValid(true);
                }
            } else {
                setCharactersLeft(maxChar);
            }
        }
    },[])

    useEffect(() => {
        if (type === "url" && value && checkValidity(value, "url")) {
            setIsValid(true);
        }
    },[])

    useEffect(() => {
        if (type === "currency" && value) {
            setIsValid(true);
        }
    },[])

    const handleChange = (e) => {
        let value;

        if (type === "currency") {
            value = e.floatValue;
            if (isNaN(value)) {
                setIsValid(false);
            } else {
                setIsValid(true);
            }
        } else {
            value = e.target.value;
        }

        let check;

        if(maxChar) {
            check = checkValidity(value, "maxChar");
            setCharactersLeft(maxChar - value.length);
        }

        if ( type === "url" ) {
            check = checkValidity(value, "url")
        }

        if (check) {

            if (sections) {

                let element = elementName.split(/(\d+)/);
                if (elementName.includes("video")) {
                    element = element[0] + element[2].replace('_', '');
                } else {
                    element = element[2].replace('_', '');
                }

                setSections(sections.map((section) => {
                    if (section.id === currentSection.id) {
                        return {
                            ...section,
                            [`${element}`]: value,
                        }
                    }
                    return section;
                }))

            } else {
                dispatch({
                    type: LP_ACTIONS.UPDATE_PAGE_DATA,
                    payload: {
                        value: value,
                        name: elementName
                    }
                })
            }
        } else if (type === "currency") {

             dispatchOffer({
                 type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                 payload: {
                     value: value,
                     name: elementName
                }
             })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isValid) {
            if (sections) {

                let element = elementName.split(/(\d+)/);
                if (elementName.includes("video")) {
                    element = element[0] + element[2].replace('_', '');
                } else {
                    element = element[2].replace('_', '');
                }
                const packets = {
                    [`${element}`]: e.target.value,
                };

                updateSectionData(packets, currentSection.id);

            } else if (offerData) {

                const packets = {
                    [`${elementName}`]: offerData[elementName],
                };

                updateOfferData(packets, offerData["id"]);

            } else {
                const value = courseData[elementName];
                const packets = {
                    [`${elementName}`]: value,
                };

                updateData(packets, courseData["id"], elementName);
            }
        }
    }

    const checkValidity = (value, checkType) => {

        if (checkType === "url") {
            if (validator.isURL(value)) {
                setIsValid(true)
                return true;
            } else {
                setIsValid(false)
                return false;
            }
        } else if (checkType === "maxChar") {
            if ( (maxChar - value.length) >= 0) {
                setIsValid(true);
                return true;
            } else {
                setIsValid(false)
                return false;
            }
        }

    }

    const switchStatement = () => {
        switch(type) {
            case 'text' || 'url' :
                return (
                    <input maxLength={maxChar}
                           name={elementName}
                           type={type}
                           placeholder={placeholder}
                           defaultValue={value || ""}
                           onChange={(e) => handleChange(e)}
                           onKeyDown={event => {
                               if (event.key === 'Enter') {
                                   handleSubmit(event);
                               }
                           }}
                           onBlur={(e) => handleSubmit(e)}
                    />
                )
            case 'textarea':
                return (
                    <textarea
                        name={elementName}
                        placeholder={placeholder}
                        defaultValue={value || ""}
                        rows={5}
                        onChange={(e) => handleChange(e)}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                handleSubmit(event);
                            }
                        }}
                        onBlur={(e) => handleSubmit(e)}
                    ></textarea>
                )
            case 'currency' :

                return (
                    <NumberFormat
                        thousandSeparator={true}
                        prefix={'$'}
                        className="some"
                        inputMode="numeric"
                        value={offerData[elementName] || ""}
                        placeholder={placeholder}
                        decimalScale={2}
                        fixedDecimalScale={true}
                        allowNegative={false}
                        onValueChange={(e) => handleChange(e)}
                        onKeyDown={event => {
                            if (event.key === 'Enter') {
                                handleSubmit(event);
                            }
                        }}
                        onBlur={(e) => handleSubmit(e)}
                    />
                )
            default:
                return (
                    <input maxLength={maxChar}
                           name={elementName}
                           type={type}
                           placeholder={placeholder}
                           defaultValue={value || ""}
                           onChange={(e) => handleChange(e)}
                           onKeyDown={event => {
                               if (event.key === 'Enter') {
                                   handleSubmit(event);
                               }
                           }}
                           onBlur={(e) => handleSubmit(e)}
                    />
                )
        }
    }

    /*const handleEditorChange = (contentState) => {

        setContentState(contentState)
    }*/

    return (

        <div className="edit_form">
            <form onSubmit={handleSubmit}>
                {switchStatement()}
                {isValid ?
                    <a className={`submit_circle ${type === "textarea" &&
                    "textarea"}`} href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <FiThumbsUp/>
                        <div className="hover_text submit_button">
                            <p>{hoverText}</p></div>
                    </a>
                    :
                    <span className={`cancel_icon ${type === "textarea" &&
                    "textarea"}`}>
                        <FiThumbsDown/>
                    </span>
                }
                {maxChar &&
                    <div className="my_row info_text title">
                        <p className="char_max">Max {maxChar} Characters</p>
                        <p className="char_count">
                            {charactersLeft < 0 ?
                                <span className="over">Over Character Limit</span>
                                :
                                <>
                                    Characters Left: <span className="count"> {charactersLeft} </span>
                                </>
                            }
                        </p>
                    </div>
                }
            </form>
            {/*<ToolTipIcon section="title" />*/}
        </div>

    );
};

export default InputComponent;
