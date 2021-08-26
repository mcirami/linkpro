import React, {useContext, useState} from 'react';
import axios from "axios";
import {PageContext} from '../App';
import {MdCheckCircle} from 'react-icons/md';
import EventBus from '../../Utils/Bus';

const PageBio = () => {


    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [characterCount, setCharacterCount] = useState(55 - pageSettings["bio"].length);

    console.log(characterCount);

    const handleChange = (e) => {
        const value = e.target.value;

        setCharacterCount(55 - value.length);
        setPageSettings({
            ...pageSettings,
            bio: value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            bio: pageSettings["bio"],
        };

        axios.post('/dashboard/page/update-bio/' + pageSettings['id'], packets)
        .then(
            (response) => {
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
                <textarea name="bio" id="" rows="5"
                          defaultValue={pageSettings["bio"]}
                          onChange={(e) => handleChange(e) }
                          onKeyPress={ event => {
                                  if(event.key === 'Enter') {
                                      handleSubmit(event);
                                  }
                              }
                          }
                >

                </textarea>
                <div className="my_row characters">
                    <p className="char_max">Max 55 Characters</p>
                    <p className="char_count">
                        Characters Left: <span className={characterCount < 0 ? "over" : ""}>{characterCount}</span>
                    </p>
                </div>

                {/*<input name="bio" type="text" defaultValue={pageSettings["bio"]}
                       onChange={(e) => handleChange(e) }
                       onKeyPress={ event => {
                               if(event.key === 'Enter') {
                                   handleSubmit(event);
                               }
                           }
                       }
                />*/}
               {/* <button className="button settings" type="submit"><MdCheckCircle /></button>*/}
                {/*<a href="#" onClick={() => setIsEditing(false)}><MdCancel /></a>*/}
            </form>

            {/*<p>{name}<a className="edit_icon" onClick={(e) => setIsEditing(true) }><MdEdit /></a></p>*/}

        </div>

    );
}

export default PageBio;
