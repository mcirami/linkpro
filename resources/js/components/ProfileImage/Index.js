import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (document.getElementById('profile_img')) {

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('profile_img'));

}
