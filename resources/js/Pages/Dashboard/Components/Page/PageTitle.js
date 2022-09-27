import React, {useContext, useEffect, useState, useRef} from 'react';
import {PageContext} from '../../App';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import {
    displayInfoBox,
    pageTitle,
    toolTipClick,
} from '../../../../Services/PageRequests';
import {BiHelpCircle} from 'react-icons/bi';

const PageTitle = ({ infoIndex, setInfoIndex }) => {

    const { pageSettings, setPageSettings, setInfoText, setInfoTextOpen, setInfoLocation } = useContext(PageContext);
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
                       onKeyDown={ event => {
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
            <div className="tooltip_icon" onMouseLeave={() => setInfoTextOpen(false)}>
                <div className="icon_wrap"
                    onClick={() => toolTipClick(4, infoIndex, setInfoIndex, infoDiv)}
                    onMouseEnter={(e) => displayInfoBox(e, setInfoText, setInfoTextOpen, setInfoLocation)} data-section="title"
                >
                    <BiHelpCircle />
                </div>
            </div>
        </div>

    );
}

export default PageTitle;
