import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {PageContext} from '../App';
import {MdCheckCircle} from 'react-icons/md';
import EventBus from '../../Utils/Bus';

const PageTitle = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [characterCount, setCharacterCount] = useState();

    useEffect(() => {
        setCharacterCount(30 - pageSettings["title"].length);
    },[characterCount])

    const handleChange = (e) => {
        const value = e.target.value;

        setCharacterCount(30 - value.length);

        setPageSettings({
            ...pageSettings,
            title: value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            title: pageSettings["title"],
        };

        axios.post('/dashboard/page/update-title/' + pageSettings['id'], packets)
        .then(
            response => {
                //console.log(JSON.stringify(response.data))
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
            }
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
                           console.log(event);
                               if(event.key === 'Enter') {
                                   handleSubmit(event);
                               }
                           }
                       }
                />
                {characterCount > -1 ?
                    <a className="submit_circle" href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <MdCheckCircle />
                    </a>
                    :
                    ""
                }
                <div className="my_row characters title">
                    <p className="char_max">Max 30 Characters</p>
                    <p className="char_count">
                        {characterCount < 0 ?
                            <span className="over">Over Character Limit</span>
                            :
                            "Characters Left: " + characterCount
                        }
                    </p>
                </div>
                {/*<button className="button settings" type="submit"><MdCheckCircle /></button>*/}
                {/*<a href="#" onClick={() => setIsEditing(false)}><MdCancel /></a>*/}
            </form>

            {/*<p>{name}<a className="edit_icon" onClick={(e) => setIsEditing(true) }><MdEdit /></a></p>*/}

        </div>

    );
}

export default PageTitle;
