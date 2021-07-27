import React, {useState} from 'react';
import axios from 'axios';

const PageName = ({page}) => {

    const [name, setName] = useState(page['name']);
    //const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: name,
        };

        axios.post('/dashboard/page/name-update/' + page['id'], packets).then(
            response => console.log(JSON.stringify(response.data)),
            //setIsEditing(false)
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        });
    };

    return (

        <div className="edit_form">
            <label>Link.pro/</label>
               <form>
                    <input type="text" defaultValue={name}
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
