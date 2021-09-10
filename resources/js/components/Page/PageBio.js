import React, {useContext, useState, useEffect} from 'react';
import axios from "axios";
import {PageContext} from '../App';
import {GiThumbDown, GiThumbUp} from 'react-icons/Gi';
import EventBus from '../../Utils/Bus';

const PageBio = () => {


    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [characterCount, setCharacterCount] = useState();

    useEffect(() => {
        setCharacterCount(65 - pageSettings["bio"].length);
    },[characterCount])

    const handleChange = (e) => {
        const value = e.target.value;

        setCharacterCount(65 - value.length);
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
            <form onSubmit={handleSubmit} className="bio">
                <textarea maxLength="65" name="bio" id="" rows="5"
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
                {characterCount > -1 ?
                    <a className="submit_circle" href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <GiThumbUp />
                    </a>
                    :
                    ""
                }
                <div className="my_row characters">
                    <p className="char_max">Max 65 Characters</p>
                    <p className="char_count">
                        {characterCount < 0 ?
                            <span className="over">Over Character Limit</span>
                            :
                            "Characters Left: " + characterCount
                        }
                    </p>
                </div>
            </form>

        </div>

    );
}

export default PageBio;
