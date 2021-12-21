import React, {useState} from 'react';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import {addPage} from '../../Services/PageRequests';

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

        addPage(packets)
        .then((data) => {

            if (data.success) {
                window.location.href = "/plans"
            }
        })
    };

    const checkPageName = (e) => {
        let value = e.target.value.toLowerCase().replace(/\s/g, '-');
        const match = pageNames.indexOf(value);

        if (match < 0 && value.length > 2) {
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
