import React, {useContext, useState} from 'react';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import {PageContext} from '../App';
import {updatePageName} from '../../Services/PageRequests';

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

            updatePageName(packets, pageSettings["id"] )
            .then((data) => {
                if (data.success) {
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

                    if (pageSettings["default"]) {
                        document.querySelector('#username').innerText = name;
                    }
                }
            })
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
        </div>

    );
}


export default PageName;
