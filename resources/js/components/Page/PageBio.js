import React, {useContext, useState, useEffect} from 'react';
import axios from "axios";
import {PageContext} from '../App';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import EventBus from '../../Utils/Bus';

const PageBio = () => {


    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [charactersLeft, setCharactersLeft] = useState();

    useEffect(() => {
        if(pageSettings["bio"]) {
            setCharactersLeft(65 - pageSettings["bio"].length);
        }
    },[charactersLeft])

    const handleChange = (e) => {
        const value = e.target.value;

        setCharactersLeft(65 - value.length);
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
                          placeholder="Add Slogan/Intro Here"
                          defaultValue={pageSettings["bio"] || ""}
                          onChange={(e) => handleChange(e) }
                          onKeyPress={ event => {
                                  if(event.key === 'Enter') {
                                      handleSubmit(event);
                                  }
                              }
                          }
                >
                </textarea>
                {charactersLeft < 62  ?
                    <a className="submit_circle" href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <FiThumbsUp />
                    </a>
                    :
                    <span className="cancel_icon">
                        <FiThumbsDown />
                    </span>
                }
                <div className="my_row characters">
                    <p className="char_max">Max 65 Characters</p>
                    <p className="char_count">
                        {charactersLeft < 0 ?
                            <span className="over">Over Character Limit</span>
                            :
                            `Characters Left: ${pageSettings["bio"] ? charactersLeft : "65"}`
                        }
                    </p>
                </div>
            </form>

        </div>

    );
}

export default PageBio;
