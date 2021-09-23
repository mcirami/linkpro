import CreatePageForm from './CreatePageForm';
import React from 'react';
let pageNames = user.pageNames;

function App() {

    return (
        <CreatePageForm allUserPages={pageNames}/>
    )
}

export default App;
