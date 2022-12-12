import React, {useEffect, useState} from 'react';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import ToolTipIcon from '../../Dashboard/Components/Page/ToolTipIcon';
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const InputComponent = ({
                            placeholder,
                            type,
                            maxChar,
                            hoverText,
                            value,
                            elementName,
                            setTextArray
}) => {

    const [charactersLeft, setCharactersLeft] = useState(maxChar);
    //const [editorState, setEditorState] = useState(value)
    //const [contentState, setContentState] = useState(value)

    useEffect(() => {
        /*if(pageSettings["title"]) {
            setCharactersLeft(30 - pageSettings["title"].length);
        } else {
            setCharactersLeft(30);
        }*/
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

    }

    /*const handleEditorChange = (contentState) => {

        setContentState(contentState)
    }*/

    return (

        <div className="edit_form">
            <form onSubmit={handleSubmit}>
                {{"text" :
                    <input maxLength={maxChar} name="title" type="text"
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
