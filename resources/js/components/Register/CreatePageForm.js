import React, {useState} from 'react';
import axios from 'axios';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import EventBus from '../../Utils/Bus';

let pageNames = user.pageNames;

const CreatePageForm = () => {

    const [newPageName, setNewPageName] = useState(null);
    const [available, setAvailability] = useState(false);

    //const pageCount = allUserPages.length;

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: newPageName,
        };

        axios.post('/dashboard/page/new', packets).then(
            (response) => {
                console.log(JSON.stringify(response.data));
                window.location.href = "/plans"
                /*const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });*/
            },

        ).catch(error => {
            const errorMessage = error.response.data.errors['name'][0];
            EventBus.dispatch("error", {message: errorMessage});
            //console.log("ERROR:: ", error.response.data.errors['name']);
            //console.log(errorMessage);

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

    //const pageList = allUserPages.filter(element => element.id !== pageSettings["id"]);

    return (

        <form className="new_page" onSubmit={handleSubmit}>
            <div className="d-flex justify-content-center align-items-flex-start link_name">
                <label className="pt-1">Link.pro/</label>
                <div className="input_wrap">
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
                        <span className="cancel_icon">
                         <FiThumbsDown />
                    </span>

                    }
                    <p className="status">{available ? "Available" : <span className="status not_available">Not Available</span>}</p>
                </div>
            </div>
            <div className="my_row button_row">
                <button className="button blue" type="submit">
                    Submit
                </button>
            </div>
        </form>


    );
}

export default CreatePageForm;
