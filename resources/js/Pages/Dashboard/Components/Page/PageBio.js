import React, {useContext, useState, useEffect, useRef} from 'react';
import axios from "axios";
import {PageContext} from '../../App';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import {BiHelpCircle} from 'react-icons/bi';
import {
    displayInfoBox,
    pageBio,
    toolTipClick,
} from '../../../../Services/PageRequests';

const PageBio = ({ infoIndex, setInfoIndex }) => {


    const { pageSettings, setPageSettings, setInfoText, setInfoTextOpen, setInfoLocation } = useContext(PageContext);
    const [charactersLeft, setCharactersLeft] = useState();

    const infoDiv = useRef();

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
                          onKeyDown={ event => {
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
                <div className="my_row info_text">
                    <p className="char_max">Max 65 Characters</p>
                    <p className="char_count">
                        {charactersLeft < 0 ?
                            <span className="over">Over Character Limit</span>
                            :
                            <>
                                Characters Left: <span> {pageSettings["bio"] ? charactersLeft : "65"}</span>
                            </>
                        }
                    </p>
                </div>
            </form>
            <div className="tooltip_icon" onMouseLeave={() => setInfoTextOpen(false)}>
                <div className="icon_wrap"
                    onClick={() => toolTipClick(5, infoIndex, setInfoIndex, infoDiv)}
                    onMouseEnter={(e) => displayInfoBox(e, setInfoText, setInfoTextOpen, setInfoLocation)} data-section="bio"
                >
                    <BiHelpCircle />
                </div>
            </div>
        </div>

    );
}

export default PageBio;
