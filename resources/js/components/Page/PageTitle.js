import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {PageContext} from '../App';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import EventBus from '../../Utils/Bus';
import {pageTitle} from '../../Services/PageRequests';

const PageTitle = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [charactersLeft, setCharactersLeft] = useState();

    useEffect(() => {
        if(pageSettings["title"]) {
            setCharactersLeft(30 - pageSettings["title"].length);
        } else {
            setCharactersLeft(30);
        }
    },[charactersLeft])

    const handleChange = (e) => {
        const value = e.target.value;

        setCharactersLeft(30 - value.length);

        setPageSettings({
            ...pageSettings,
            title: value,
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (pageSettings["title"] != null) {

            const packets = {
                title: pageSettings["title"],
            };

            pageTitle(packets, pageSettings["id"]);
        }
    }

    return (

        <div className="edit_form">
            <form onSubmit={handleSubmit}>
                <input maxLength="30" name="title" type="text"
                       placeholder="Add Title"
                       defaultValue={pageSettings["title"] || ""}
                       onChange={(e) => handleChange(e) }
                       onKeyPress={ event => {
                               if(event.key === 'Enter') {
                                   handleSubmit(event);
                               }
                           }
                       }
                       onBlur={(e) => handleSubmit(e)}
                />
                {charactersLeft < 30 ?
                    <a className="submit_circle" href="#"
                       onClick={(e) => handleSubmit(e)}
                    >
                        <FiThumbsUp />
                        <div className="hover_text submit_button"><p>Submit Title Text</p></div>
                    </a>
                    :
                    <span className="cancel_icon">
                        <FiThumbsDown />
                    </span>
                }
                <div className="my_row characters title">
                    <p className="char_max">Max 30 Characters</p>
                    <p className="char_count">
                        {charactersLeft < 0 ?
                            <span className="over">Over Character Limit</span>
                            :
                            "Characters Left: " + charactersLeft
                        }
                    </p>
                </div>
            </form>

        </div>

    );
}

export default PageTitle;
