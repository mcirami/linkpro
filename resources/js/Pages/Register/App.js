import CreatePageForm from './CreatePageForm';
import React from 'react';

function App() {

    return (

        <div className="card guest">
            <div className="mb-4">
                <h3>Choose Your Link Name</h3>
                <p className="small">(Default link name or email address can be used to login)</p>
            </div>
            <div className="card-body">
                <div className="form_wrap">

                    <CreatePageForm />

                </div>
            </div>

        </div>

    )
}

export default App;
