import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (document.getElementById('contact_form')) {

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('contact_form'));
}
