import React, {useState, useEffect, useRef} from 'react';
import {LP_ACTIONS} from '../Reducer';
import { Editor } from '@tinymce/tinymce-react';
import { ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from "html-to-draftjs";

import {
    updateSectionData,
} from '../../../Services/LandingPageRequests';
import {
    updateData as updateCourseData
} from '../../../Services/CourseRequests';
import isJSON from 'validator/es/lib/isJSON';
import {toJSON} from 'lodash/seq';

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

    const editorRef = useRef(null);

    const [editorState, setEditorState] = useState("");
    const [editorValue, setEditorValue] = useState("");



    useEffect(() => {
        if (currentSection) {

            setEditorState(
                currentSection["text"] && isJSON(currentSection["text"]) ?
                    draftToHtml(JSON.parse(currentSection["text"]))
                    :
                    ""
            )

        } else {
            setEditorState(
                data["intro_text"] && isJSON(data["intro_text"]) ?
                    draftToHtml(JSON.parse(data["intro_text"]))
                    :
                    ""
            )
        }
    },[])

    useEffect(() => {
        if (currentSection) {
            if (currentSection["text"] && isJSON(currentSection["text"]) &&
                JSON.parse(currentSection["text"])["blocks"][0]["text"] !== "") {
                setIsValid(true)
            }
        } else {
            if (data["intro_text"] && isJSON(data["intro_text"]) &&
                JSON.parse(data["intro_text"])["blocks"][0]["text"] !== "") {
                setIsValid(true)
            }
        }
    },[])

    const handleEditorChange = () => {

        const value = editorRef.current.getContent();
        setEditorValue(value);

        if (value !== "") {
            setIsValid(true);

            if (sections) {

                let element = elementName.split(/(\d+)/);
                element = element[2].replace('_', '');

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
        } else {
            setIsValid(false);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isValid) {

            const blocksFromHTML = htmlToDraft(editorValue);

            const { contentBlocks, entityMap } = blocksFromHTML;

           /* const state = ContentState.createFromBlockArray(
                blocksFromHTML.contentBlocks,
                blocksFromHTML.entityMap,
            );*/

            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);

            const finalValue = convertToRaw(contentState);

            if (sections) {

                let element = elementName.split(/(\d+)/);
                element = element[2].replace('_', '');

                const packets = {
                    [`${element}`]: finalValue,
                };

                updateSectionData(packets, currentSection.id);

            } else {
                //const value = data[elementName];
                const packets = {
                    [`${elementName}`]: finalValue,
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
                apiKey='h3695sldkjcjhvyl34syvczmxxely99ind71gtafhpnxy8zj'
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={editorState}
                value={editorValue}
                onEditorChange={handleEditorChange}
                onBlur={(e) => handleSubmit(e)}
                onSubmit={(e) => handleSubmit(e)}
                init={{
                    height: 500,
                    width: 100 + '%',
                    menubar: true,
                    selector: 'textarea',
                    newline_behavior: 'linebreak',
                    menu: {
                        edit: {
                            title: 'Edit',
                            items: 'undo redo | cut copy paste pastetext | selectall | searchreplace'
                        },
                        view: {
                            title: 'View',
                            items: 'code | visualaid visualchars visualblocks | spellchecker | preview fullscreen | showcomments'
                        },
                        insert: {
                            title: 'Insert',
                            items: 'link | emoticons hr | pagebreak '
                        },
                        format: {
                            title: 'Format',
                            items: 'bold italic underline strikethrough superscript subscript | styles blocks fontfamily fontsize align lineheight | forecolor backcolor | language | removeformat'
                        },
                        tools: {
                            title: 'Tools',
                            items: 'spellchecker spellcheckerlanguage | a11ycheck wordcount'
                        },
                    },
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | forecolor backcolor',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                }}
            />
        </div>
    );
};


export default EditorComponent;
