import React, {useContext} from 'react';
import axios from "axios";
import {PageContext} from '../App';
import {MdCheckCircle} from 'react-icons/md';

const PageTitle = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const handleChange = (e) => {
        setPageSettings({
            ...pageSettings,
            title: e.target.value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            title: pageSettings["title"],
        };

        axios.post('/dashboard/page/update-title/' + pageSettings['id'], packets).then(
            response => console.log(JSON.stringify(response.data)),
            //setIsEditing(false)
        ).catch(error => {
            console.log("ERROR:: ", error.response.data);

        });
    }

    return (

        <div className="edit_form">
            <form onSubmit={handleSubmit}>
                <input name="title" type="text" defaultValue={pageSettings["title"]}
                       onChange={(e) => handleChange(e) }
                       onKeyPress={ event => {
                               if(event.key === 'Enter') {
                                   handleSubmit(event);
                               }
                           }
                       }
                />
                {/*<button className="button settings" type="submit"><MdCheckCircle /></button>*/}
                {/*<a href="#" onClick={() => setIsEditing(false)}><MdCancel /></a>*/}
            </form>

            {/*<p>{name}<a className="edit_icon" onClick={(e) => setIsEditing(true) }><MdEdit /></a></p>*/}

        </div>

    );
}

export default PageTitle;
