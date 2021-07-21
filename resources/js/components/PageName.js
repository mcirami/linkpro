import React, {useState} from 'react';
import IconList from './IconList';
import axios, {post} from 'axios';
import { MdEdit, MdCancel } from 'react-icons/md';

const PageName = ({page}) => {

    const [linkPageName, setLinkPageName] = useState(page['name']);
    const [isEditing, setIsEditing] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: linkPageName,
        };

        axios.post('/dashboard/page/name-update/' + page['id'], packets).then(
            response => console.log(JSON.stringify(response.data)),
            setIsEditing(false)
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        });
    };

    return (

        <div className="edit_form">
            <h4>Page URL</h4>
            {isEditing ?
               <form>
                    <label>https://link.pro/</label>
                    <input type="text" defaultValue={linkPageName}
                           onChange={(e) => setLinkPageName(e.target.value) }
                           onKeyPress={ event => {
                                   if(event.key === 'Enter') {
                                       handleSubmit(event);
                                   }
                               }
                           }
                    />
                    <a href="#" onClick={() => setIsEditing(false)}><MdCancel /></a>
               </form>
                :
                <p>https://link.pro/{linkPageName}<a onClick={(e) => setIsEditing(true) }><MdEdit /></a></p>
            }


        </div>

    );
}


export default PageName;
