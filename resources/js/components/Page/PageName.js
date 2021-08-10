import React, {useState} from 'react';
import axios from 'axios';
import EventBus from '../../Utils/Bus';

const PageName = ({page}) => {

    const [name, setName] = useState(page['name']);
    //const [isEditing, setIsEditing] = useState(false);

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

    return (

        <div className="edit_form">
            <label>Link.pro/</label>
               <form>
                    <input name="name" type="text" defaultValue={name}
                           onChange={(e) => setName(e.target.value) }
                           onKeyPress={ event => {
                                   if(event.key === 'Enter') {
                                       handleSubmit(event);
                                   }
                               }
                           }
                    />
                    {/*<a href="#" onClick={() => setIsEditing(false)}><MdCancel /></a>*/}
               </form>

            {/*<p>{name}<a className="edit_icon" onClick={(e) => setIsEditing(true) }><MdEdit /></a></p>*/}

        </div>

    );
}


export default PageName;
