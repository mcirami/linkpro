import CreatePageForm from './CreatePageForm';
import React from 'react';

function App() {

    return (

        <div className="card guest">
            <h3>Choose Your Link Name</h3>
            <div className="card-body">
                <div className="form_wrap">

                    <CreatePageForm />

                </div>
            </div>
        </div>

    )
}

export default App;
