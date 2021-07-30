import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import UserContext from './User/User';
import User from './User/User';
import myLinksArray from './Link/LinkItems';

if (document.getElementById('root')) {

    ReactDOM.render(
            <React.StrictMode>
                <UserContext.Provider value={myLinksArray}>
                    <App />
                </UserContext.Provider>
            </React.StrictMode>,
        document.getElementById('root'));

}
