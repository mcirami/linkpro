import React, {useState} from 'react';
import axios from 'axios';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import EventBus from '../../Utils/Bus';

const CreatePageForm = ({allUserPages}) => {


    const [newPageName, setNewPageName] = useState(null);
    const [available, setAvailability] = useState(false);

    const pageCount = allUserPages.length;

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: newPageName,
        };

        axios.post('/dashboard/page/new', packets).then(
            (response) => {
                //console.log(JSON.stringify(response.data));

                const page_id = JSON.stringify(response.data.page_id);
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });

                const newElement = {
                    id: page_id,
                    name: newPageName,
                };
            },

        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        });
    };

    const checkPageName = (e) => {
        let value = e.target.value.toLowerCase().replace(/\s/g, '-');
        const match = pageNames.indexOf(value);

        if (match < 0 && value !== "") {
            setAvailability(true);
        } else {
            setAvailability(false);
        }

        setNewPageName(value)
    }

    const pageList = allUserPages.filter(element => element.id !== pageSettings["id"]);

    return (

        <div className="edit_form new_page_form">
            <div className="form_wrap">
                <h3>Choose Your Link Name</h3>
                <form className="new_page" onSubmit={handleSubmit}>
                    <input name="name" type="text"
                           placeholder="Link Name"
                           onChange={ checkPageName }
                           onKeyPress={ event => {
                               if(event.key === 'Enter') {
                                   handleSubmit(event);
                               }
                           }
                           }
                    />

                    { available ?
                        <a className="submit_circle" href="#"
                           onClick={(e) => handleSubmit(e)}
                        >
                            <FiThumbsUp />
                        </a>
                        :
                        <FiThumbsDown />
                    }
                    <p className="status">{available ? "Available" : <span className="status not_available">Not Available</span>}</p>
                    <div className="my_row button_row">
                        <button className="button green" type="submit">
                            Submit
                        </button>
                    </div>
                </form>
            </div>

        </div>

    );
}

export default CreatePageForm;
