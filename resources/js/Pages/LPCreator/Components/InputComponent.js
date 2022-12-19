import React, {useEffect, useState} from 'react';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import {updateText} from '../../../Services/LandingPageRequests';
import {LP_ACTIONS} from '../Reducer';

const InputComponent = ({
                            placeholder,
                            type,
                            maxChar,
                            hoverText,
                            value,
                            elementName,
                            textArray,
                            setTextArray,
                            pageID,
                            dispatch
}) => {

    const [charactersLeft, setCharactersLeft] = useState(maxChar);
    //const [editorState, setEditorState] = useState(value)
    //const [contentState, setContentState] = useState(value)

    useEffect(() => {
        if(value) {
            setCharactersLeft(maxChar - value.length);
        } else {
            setCharactersLeft(maxChar);
        }
    },[])

    const handleChange = (e) => {
        const value = e.target.value;
        setCharactersLeft(maxChar - value.length);
        setTextArray((prev) => ({
            ...prev,
            [`${elementName}`]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const value = textArray[elementName];

        const packets = {
            [`${elementName}`]: value,
        };

        updateText(packets, pageID, elementName)
        .then((response) => {
            if (response.success) {
                dispatch({
                    type: LP_ACTIONS.UPDATE_TEXT,
                    payload: {
                        value: value,
                        name: elementName
                    }
                })
            }
        })

    }

    /*const handleEditorChange = (contentState) => {

        setContentState(contentState)
    }*/

    return (

        <div className="edit_form">
            <form onSubmit={handleSubmit}>
                {{"text" :
                    <input maxLength={maxChar}
                           name={elementName}
                           type="text"
                           placeholder={placeholder}
                           defaultValue={value}
                           onChange={(e) => handleChange(e)}
                           onKeyDown={event => {
                               if (event.key === 'Enter') {
                                   handleSubmit(event);
                               }
                           }}
                           onBlur={(e) => handleSubmit(e)}
                    />,
                    "textarea" :
                        <textarea
                            name={elementName}
                            placeholder={placeholder}
                            defaultValue={value}
                            rows={5}
                            onChange={(e) => handleChange(e)}
                            onKeyDown={event => {
                                if (event.key === 'Enter') {
                                    handleSubmit(event);
                                }
                            }}
                        ></textarea>
                   /* <Editor
                        initialEditorState={contentState}
                        onEditorStateChange={handleEditorChange}
                        toolbar={{
                            options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'history'],
                        }}
                    />*/

                }[type]}
                {charactersLeft < maxChar?
                    <a className={ `submit_circle ${type === "textarea" && "textarea"}`} href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <FiThumbsUp />
                        <div className="hover_text submit_button"><p>{hoverText}</p></div>
                    </a>
                    :
                    <span className={`cancel_icon ${type === "textarea" && "textarea"}`}>
                        <FiThumbsDown />
                    </span>
                }
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
            </form>
            {/*<ToolTipIcon section="title" />*/}
        </div>

    );
};

export default InputComponent;
