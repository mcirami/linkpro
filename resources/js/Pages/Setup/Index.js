import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

if (document.getElementById('setup')) {

    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('setup'));
}
