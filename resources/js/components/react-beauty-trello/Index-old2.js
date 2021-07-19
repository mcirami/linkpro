import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { DndProvider} from 'react-dnd';
import {HTML5Backend} from "react-dnd-html5-backend";

if (document.getElementById('root')) {

    ReactDOM.render(
        <DndProvider backend={HTML5Backend}>
            <React.StrictMode>
                <App />
            </React.StrictMode>
        </DndProvider>,
        document.getElementById('root'));

}
