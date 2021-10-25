import React, {useContext, useState} from 'react';
import axios from 'axios';
import EventBus from '../../Utils/Bus';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import {PageContext} from '../App';

let pageNames = user.allPageNames;

const PageName = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [allPageNames, setAllPageNames] = useState(pageNames);

    const [name, setName] = useState(pageSettings['name']);
    //const [isEditing, setIsEditing] = useState(false);

    const [available, setAvailability] = useState(true);
    const [currentMatch, setCurrentMatch] = useState(true);
    //const currentName = page['name'];

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!currentMatch) {

            const packets = {
                name: name,
            };

            axios.post('/dashboard/page/update-name/' + pageSettings['id'],
                packets).then(
                (response) => {
                    const returnMessage = JSON.stringify(response.data.message);
                    EventBus.dispatch("success", {message: returnMessage});
                    //setIsEditing(false)
                    setAllPageNames(
                        allPageNames.map((item, index) => {
                            if (item === pageSettings['name']) {
                                item = name
                            }
                            return item;
                        })
                    )
                    setPageSettings({
                            ...pageSettings,
                            name: name
                        }
                    )
                    setCurrentMatch(true);
                }
            ).catch((error) => {
                console.log("ERROR:: ", error.response.data);

            });
        }
    };

    const checkPageName = (e) => {
        let value = e.target.value.toLowerCase().replace(/\s/g, '-');
        const match = allPageNames.indexOf(value);

        if (value.length > 2 && value === pageSettings["name"]) {
            setAvailability(true);
            setCurrentMatch(true);
        } else if (match < 0 && value.length > 2) {
            setAvailability(true);
            setCurrentMatch(false);
        } else {
            setAvailability(false);
            setCurrentMatch(false);
        }

        setName(value);
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
                           onBlur={(e) => handleSubmit(e)}
                    />

                   {available ?
                       <div>
                           {currentMatch ?
                               <p className="status">Current</p>
                               :
                               <div>
                                   <a className="submit_circle" href="#"
                                      onClick={(e) => handleSubmit(e)}
                                   >
                                       <FiThumbsUp />
                                   </a>
                                   <p className="status">Available</p>
                               </div>
                           }
                       </div>
                       :
                       <div>
                           <span className="cancel_icon">
                               <FiThumbsDown />
                           </span>
                           <p className="status not_available">Not Available</p>
                       </div>
                   }

               </form>

            {/*<p>{name}<a className="edit_icon" onClick={(e) => setIsEditing(true) }><MdEdit /></a></p>*/}

        </div>

    );
}


export default PageName;
