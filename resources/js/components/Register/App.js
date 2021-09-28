import CreatePageForm from './CreatePageForm';
import React from 'react';
import {Flash} from '../Flash';

function App() {

    return (

        <div className="card guest">
            <h3>Choose Your Link Name</h3>
            <div className="card-body">
                <div className="form_wrap">

                    <CreatePageForm />

                </div>
            </div>
            <Flash />
        </div>

    )
}

export default App;
