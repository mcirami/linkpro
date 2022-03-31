import React, {useContext, useRef, useState} from 'react';
import {FiThumbsDown, FiThumbsUp} from 'react-icons/Fi';
import {PageContext} from '../App';
import {updatePageName, toolTipClick} from '../../../../Services/PageRequests';
import {BiHelpCircle} from 'react-icons/bi';
import { Element } from  'react-scroll';
let pageNames = user.allPageNames;

const PageName = ({infoIndex, setInfoIndex}) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const [allPageNames, setAllPageNames] = useState(pageNames);

    const [name, setName] = useState(pageSettings['name']);
    //const [isEditing, setIsEditing] = useState(false);

    const [available, setAvailability] = useState(true);
    const [currentMatch, setCurrentMatch] = useState(true);
    const [regexMatch, setRegexMatch] = useState(true);

    const infoDiv = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!currentMatch && available) {

            const packets = {
                name: name,
            };

            updatePageName(packets, pageSettings["id"] )
            .then((data) => {
                if (data.success) {
                    let prevNames = [...allPageNames];

                    prevNames = prevNames.map((item, index) => {
                        if (item === pageSettings['name']) {
                            item = name
                        }
                        return item;
                    })

                    setAllPageNames(prevNames);
                    setPageSettings({
                            ...pageSettings,
                            name: name
                        }
                    )
                    setCurrentMatch(true);

                    if (pageSettings["default"]) {
                        document.querySelector('#username').innerText = name;
                        document.querySelector('#mobile_username').innerText = name;
                    }
                }
            })
        }
    };

    const checkPageName = (e) => {
        let value = e.target.value.toLowerCase();
        const match = allPageNames.indexOf(value);

        const regex = /^[A-Za-z0-9-_.]+$/;

        setRegexMatch(regex.test(value));
        if (value.length > 2 && value === pageSettings["name"]) {
            setAvailability(true);
            setCurrentMatch(true);
        } else if (match < 0 && value.length > 2 && regex.test(value)) {
            setAvailability(true);
            setCurrentMatch(false);
        } else {
            setAvailability(false);
            setCurrentMatch(false);
        }

        setName(value);
    }

    return (
        <div className="edit_form">
            {!regexMatch &&
                <p className="status not_available char_message">Only letters, numbers, dashes, underscores, periods allowed</p>
            }
            <label>Link.pro/</label>
           <form className="link_name">
                <input name="name" type="text" defaultValue={name}
                       onChange={ checkPageName }
                       onKeyPress={ event => {
                               if(event.key === 'Enter') {
                                   handleSubmit(event);
                               }
                           }
                       }
                       onBlur={(e) => handleSubmit(e)}
                />

               {available ?
                   <div className={"info_text my_row"}>
                       {currentMatch ?
                           <p className="status">Current</p>
                           :
                           <>
                               <a className="submit_circle" href="#"
                                  onClick={(e) => handleSubmit(e)}
                               >
                                   <FiThumbsUp />
                               </a>
                               <p className="status">Available</p>
                           </>
                       }
                   </div>
                   :
                   <div>
                       <span className="cancel_icon">
                           <FiThumbsDown />
                       </span>
                       <div className={"info_text my_row"}>
                           <p className="status not_available">Not Available</p>
                       </div>
                   </div>
               }

           </form>
            <div className="tooltip_icon">
                <div onClick={(e) => toolTipClick(0, infoIndex, setInfoIndex, infoDiv)}>
                    <BiHelpCircle />
                </div>

                <Element name="infoText0" className={ `hover_text help ${infoIndex === 0 ? "open" : ""}` } >
                    <div ref={infoDiv}>
                        <p>The text in this field is the name of your page and is appended to “link.pro/” to create the URL for a user’s Page (e.g. link.pro/SETUP). You are free to change this at any time if the name is not already taken by another user.</p>
                        <h5>Pro Tip!</h5>
                        <p>Choosing a simple Page Name that reflects your content makes your LinkPro URL more informative for your audience.</p>
                    </div>
                </Element>
            </div>

        </div>

    );
}


export default PageName;
