import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from "html-to-draftjs";

const TextComponent = () => {
    return (
        <Editor
            apiKey='h3695sldkjcjhvyl34syvczmxxely99ind71gtafhpnxy8zj'
            /*key={currentSection ? currentSection.id : data.id}
            onInit={(evt, editor) => editorRef.current = editor}
            initialValue={editorState}
            value={editorValue}
            onEditorChange={handleEditorChange}
            onBlur={(e) => handleSubmit(e)}
            onSubmit={(e) => handleSubmit(e)}*/
            init={{
                height: 250,
                width: 100 + '%',
                menubar: true,
                menu: {
                    file: {
                        title: 'File',
                        items: ''
                    },
                    edit: {
                        title: 'Edit',
                        items: 'undo redo | cut copy paste pastetext | selectall | searchreplace'
                    },
                    view: {
                        title: 'View',
                        items: 'preview fullscreen'
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
                    'anchor', 'searchreplace', 'fullscreen', 'wordcount'
                ],
                toolbar: 'undo redo | blocks | ' +
                    'bold italic forecolor | alignleft aligncenter ' +
                    'alignright alignjustify | bullist numlist outdent indent | ' +
                    'removeformat | forecolor backcolor',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
        />
    );
};

export default TextComponent;
