import React, {useContext, useState} from 'react';
import axios from 'axios';
import EventBus from '../../Utils/Bus';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import {PageContext} from '../App';

let pageNames = user.pageNames;

const PageName = ({allUserPages, setAllUserPages, page}) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [name, setName] = useState(pageSettings['name']);
    //const [isEditing, setIsEditing] = useState(false);

    const [available, setAvailability] = useState(true);
    const [currentMatch, setCurrentMatch] = useState(true);
    //const currentName = page['name'];

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: name,
        };

        axios.post('/dashboard/page/update-name/' + pageSettings['id'], packets)
        .then(
            (response) => {
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
                //setIsEditing(false)
            }
        )
        .catch( (error) => {
            console.log("ERROR:: ", error.response.data);

        });
    };

    const checkPageName = (e) => {
        let value = e.target.value.toLowerCase().replace(/\s/g, '-');
        const match = pageNames.indexOf(value);

        if (match < 0 && value !== "" || value === pageSettings["name"]) {
            setAvailability(true);

            if (value !== pageSettings["name"]) {
                setCurrentMatch(false);
            } else{
                setCurrentMatch(true);
            }
        } else {
            setAvailability(false);
        }

        setName(value)
        /*setAllUserPages(
            allUserPages.map((item) => {
                if (item.id === page['id']) {
                    return {
                        ...item,
                        name: value,
                    };
                }
                return item;
            })
        )*/
        setPageSettings({
                ...pageSettings,
                name: value
            }
        )
    }

    return (

        <div className="edit_form">
            <label>Link.pro/</label>
               <form className="link_name">
                    <input name="name" type="text" defaultValue={name}
                           onChange={ checkPageName }
                           onKeyPress={ event => {
                                   if(event.key === 'Enter') {
                                       handleSubmit(event);
                                   }
                               }
                           }
                    />

                   {available ?
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

                   {available ?
                       <p className="status" >{currentMatch ? "" : "Available"}</p>
                       :
                       <p className="status not_available">Not Available</p>
                   }

               </form>

            {/*<p>{name}<a className="edit_icon" onClick={(e) => setIsEditing(true) }><MdEdit /></a></p>*/}

        </div>

    );
}


export default PageName;
