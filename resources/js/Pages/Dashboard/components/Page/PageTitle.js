import React, {useContext, useEffect, useState, useRef} from 'react';
import {PageContext} from '../App';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import {pageTitle, toolTipClick} from '../../../../Services/PageRequests';
import {BiHelpCircle} from 'react-icons/bi';
import { Element } from  'react-scroll';

const PageTitle = ({ infoIndex, setInfoIndex }) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [charactersLeft, setCharactersLeft] = useState();

    const infoDiv = useRef();

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
                <div className="my_row info_text title">
                    <p className="char_max">Max 30 Characters</p>
                    <p className="char_count">
                        {charactersLeft < 0 ?
                            <span className="over">Over Character Limit</span>
                            :
                            <>
                                Characters Left: <span className="count"> {charactersLeft} </span>
                            </>
                        }
                    </p>
                </div>
            </form>
            <div className="tooltip_icon">
                <div onClick={() => toolTipClick(4, infoIndex, setInfoIndex, infoDiv)} >
                    <BiHelpCircle />
                </div>
                <Element name="infoText4" className={`hover_text help title ${infoIndex === 4 ? " open" : "" }` } >
                    <div ref={infoDiv}>
                        <p>Add a brief title to your Page (30 character max). The text is bold and displayed directly below the header image to provide viewers with a title for the content you add to your Page.</p>
                        <h5>Pro Tip!</h5>
                        <p>A shorter Page-Title allows viewers to see more icons quicker!</p>
                    </div>
                </Element>
            </div>
        </div>

    );
}

export default PageTitle;
