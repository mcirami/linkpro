import React, {useState} from 'react';
import axios from 'axios';
import EventBus from '../../Utils/Bus';
import {MdCancel, MdCheckCircle} from 'react-icons/md';

let pageNames = user.pageNames;

const PageName = ({allUserPages, setAllUserPages, page}) => {

    const [name, setName] = useState(page['name']);
    //const [isEditing, setIsEditing] = useState(false);
    const [available, setAvailability] = useState(true);
    const currentName = page['name'];

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: name,
        };

        axios.post('/dashboard/page/update-name/' + page['id'], packets)
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
        let value = e.target.value;
        const match = pageNames.indexOf(value);

        if (match < 0 && value !== "" || value === currentName) {
            setAvailability(true);
        } else {
            setAvailability(false);
        }

        setName(value)
        setAllUserPages(
            allUserPages.map((item) => {
                if (item.id === page['id']) {
                    return {
                        ...item,
                        name: value,
                    };
                }
                return item;
            })
        )
    }

    return (

        <div className="edit_form">
            <label>Link.pro/</label>
               <form>
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
                           <MdCheckCircle />
                       </a>
                       :
                       <span className="cancel_icon">
                           <MdCancel />
                       </span>

                   }

               </form>

            {/*<p>{name}<a className="edit_icon" onClick={(e) => setIsEditing(true) }><MdEdit /></a></p>*/}

        </div>

    );
}


export default PageName;
