import React, {useState, useEffect} from 'react';
import {LP_ACTIONS} from '../Reducer';
import { Editor } from "react-draft-wysiwyg";
import { ContentState, EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import {SketchPicker} from 'react-color';

import {
    updateSectionData,
} from '../../../Services/LandingPageRequests';
import {
    updateData as updateCourseData
} from '../../../Services/CourseRequests';
import isJSON from 'validator/es/lib/isJSON';

const EditorComponent = ({
                             dispatch,
                             sections = null,
                             setSections,
                             currentSection = null,
                             elementName,
                             data,
                             isValid,
                             setIsValid
}) => {

    const [editorState, setEditorState] = useState(null);

    useEffect(() => {
        if (currentSection) {
            setEditorState(
                currentSection["text"] && isJSON(currentSection["text"]) ?
                    EditorState.createWithContent(
                        convertFromRaw(JSON.parse(currentSection["text"])))
                    :
                    EditorState.createEmpty()
            )
        } else {
            setEditorState(
                data["intro_text"] && isJSON(data["intro_text"]) ?
                    EditorState.createWithContent(
                        convertFromRaw(JSON.parse(data["intro_text"])))
                    :
                    EditorState.createEmpty()
            )
        }
    },[])

    useEffect(() => {
        if (currentSection) {
            if (currentSection["text"] &&
                isJSON(currentSection["text"]) &&
                JSON.parse(currentSection["text"])["blocks"][0]["text"] !==
                "") {
                setIsValid(true)
            }
        } else {
            if (data["intro_text"] &&
                isJSON(data["intro_text"]) &&
                JSON.parse(data["intro_text"])["blocks"][0]["text"] !==
                "") {
                setIsValid(true)
            }
        }
    },[])

    const handleEditorChange = (editorState) => {

        setEditorState(editorState);
        const rawValue = convertToRaw(editorState.getCurrentContent())

        if (rawValue["blocks"][0]["text"] !== "") {
            setIsValid(true);
        } else {
            setIsValid(false);
        }

        if(sections) {

            let element = elementName.split(/(\d+)/);
            element = element[2].replace('_', '');

            setSections(sections.map((section) => {
                if (section.id === currentSection.id) {
                    return {
                        ...section,
                        [`${element}`]: draftToHtml( convertToRaw(editorState.getCurrentContent())),
                    }
                }
                return section;
            }))


        } else {
            dispatch({
                type: LP_ACTIONS.UPDATE_PAGE_DATA,
                payload: {
                    value:  draftToHtml( convertToRaw(editorState.getCurrentContent())),
                    name: elementName
                }
            })
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isValid) {
            const value = JSON.stringify(
                convertToRaw(editorState.getCurrentContent()));
            if (sections) {

                let element = elementName.split(/(\d+)/);
                element = element[2].replace('_', '');

                const packets = {
                    [`${element}`]: value,
                };

                updateSectionData(packets, currentSection.id);

            } else {
                //const value = data[elementName];
                const packets = {
                    [`${elementName}`]: value,
                };

                updateCourseData(packets, data["id"], elementName).
                    then((response) => {
                        if (response.success && response.slug) {
                            dispatch({
                                type: LP_ACTIONS.UPDATE_PAGE_DATA,
                                payload: {
                                    value: response.slug,
                                    name: 'slug'
                                }
                            })
                        }
                    })
            }
        }
    }

    return (
        <div className="page_settings border_wrap wysiwyg">
            <Editor
                /*defaultContentState={contentState}*/
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                onKeyDown={event => {
                    if (event.key === 'Enter') {
                        handleSubmit(event);
                    }
                }}
                onBlur={(e) => handleSubmit(e)}
                toolbar={{
                    options: ['inline', 'blockType', 'list', 'textAlign', 'colorPicker', 'link', 'emoji', 'history'],
                    inline: {
                        options: ['bold', 'italic', 'underline', 'strikethrough']
                    },
                    blockType: {
                        options: ['Normal', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6']
                    }
                }}
            />
        </div>
    );
};

export default EditorComponent;
