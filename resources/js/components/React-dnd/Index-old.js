import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {HTML5Backend} from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { GridProvider } from "./GridContext";

if (document.getElementById('root')) {

    ReactDOM.render(
        <DndProvider backend={HTML5Backend}>
            <GridProvider>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </GridProvider>
        </DndProvider>,
        document.getElementById('root'));

}
