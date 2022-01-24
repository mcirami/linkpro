import React, {useContext, useState, useEffect} from 'react';
import axios from "axios";
import {PageContext} from '../App';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import EventBus from '../../../../Utils/Bus';
import {pageBio} from '../../../../Services/PageRequests';

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

        if (pageSettings["bio"] != null) {

            const packets = {
                bio: pageSettings["bio"],
            };

            pageBio(packets, pageSettings["id"]);
        }
    }

    return (

        <div className="edit_form">
            <form onSubmit={handleSubmit} className="bio">
                <textarea maxLength="65" name="bio" id="" rows="5"
                          placeholder="Add Bio or Slogan (Optional)"
                          defaultValue={pageSettings["bio"] || ""}
                          onChange={(e) => handleChange(e) }
                          onKeyPress={ event => {
                                  if(event.key === 'Enter') {
                                      handleSubmit(event);
                                  }
                              }
                          }
                          onBlur={(e) => handleSubmit(e)}
                >
                </textarea>
                {charactersLeft < 62  ?
                    <a className="submit_circle" href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <FiThumbsUp />
                        <div className="hover_text submit_button"><p>Submit Bio Text</p></div>
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
