import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (document.getElementById('off_canvas_course_menu')) {

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('off_canvas_course_menu'));
}
