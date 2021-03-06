import React, {useContext, useState, useEffect} from 'react';
import {MdAddCircleOutline} from 'react-icons/md';
import {FiThumbsDown, FiThumbsUp, FiChevronDown} from 'react-icons/Fi';
import {PageContext} from '../../App';
import {addPage} from '../../../../Services/PageRequests';

let pageNames = user.allPageNames;

const PageNav = ({ allUserPages, setAllUserPages, userSub, subStatus, setShowUpgradePopup, setOptionText }) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [isEditing, setIsEditing] = useState(false);
    const [newPageName, setNewPageName] = useState(null);
    const [available, setAvailability] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        const packets = {
            name: newPageName,
        };

        addPage(packets)
        .then((data) => {
            if (data.success) {
                const newElement = {
                    id: data.page_id,
                    name: newPageName,
                };

                let prevPages = [...allUserPages];
                prevPages = prevPages.concat(newElement);
                setAllUserPages(prevPages);
                setIsEditing(false);

                window.location.href = "/dashboard/pages/" + data.page_id;

            }
        })

    };

    const checkPageName = (e) => {
        let value = e.target.value.toLowerCase().replace(/\s/g, '-');
        const match = pageNames.indexOf(value);

        if (match < 0 && value !== "") {
            setAvailability(true);
        } else {
            setAvailability(false);
        }

        setNewPageName(value)
    }

    const pageList = allUserPages.filter(element => element.id !== pageSettings["id"]);

    const handleClick = (e) => {
        e.preventDefault();

        const type = e.target.dataset.type

        if (type !== undefined && type === 'disabled') {

            enablePopup("access this link");

        } else if (userSub) {

            const {name} = {...userSub};

            if ( subStatus && name === "premier") {

                if (allUserPages.length === 5) {
                    enablePopup("a custom plan to add more links");
                } else {
                    setIsEditing(true);
                }

            } else {
                enablePopup("add more links");
            }

        } else {
            enablePopup("add more links");
        }
    }

    const enablePopup = (text) => {

        setShowUpgradePopup(true);
        setOptionText(text);
    }

    return (
        <div className="page_menu_row">
            <div className="current_page" id={pageSettings["id"]} key={pageSettings["id"]}>
                <p>{pageSettings["name"]}</p>
            </div>
            <div className="menu_wrap">

                <div className={allUserPages.length > 1 ? "menu_icon add_border" : "menu_icon"}>
                    {allUserPages.length > 1 ?
                        <FiChevronDown/>
                        :
                        <MdAddCircleOutline/>
                    }

                    <div className="menu_content">
                        <ul className="page_menu">
                            <li>
                                <a onClick={(e) => { handleClick(e) }} href="#">Add New Link</a>
                            </li>
                            { pageList.map((page) => {

                                return (
                                    page["disabled"] || !userSub || userSub.name !== "premier" ?
                                        <li key={page["id"]} className="disabled_link" data-type="disabled" onClick={(e) => { handleClick(e) }} >
                                            {page["name"]}
                                        </li>
                                        :
                                        <li id={page["id"]} key={page["id"]}>
                                            <a href={"/dashboard/pages/" + page["id"]}>{page["name"]}</a>
                                        </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>

            </div>

            {isEditing ?
                <div className="edit_form popup new_page_form">
                    <div className="form_wrap">
                        <h3>Choose Your Link Name</h3>
                        <form className="new_page" onSubmit={handleSubmit}>
                            <input name="name" type="text"
                                   placeholder="Link Name"
                                   onChange={ checkPageName }
                                   onKeyDown={ event => {
                                       if(event.key === 'Enter') {
                                           handleSubmit(event);
                                       }
                                   }
                                   }
                            />

                            { available ?
                                <a className="submit_circle" href="#"
                                   onClick={(e) => handleSubmit(e)}
                                >
                                    <FiThumbsUp />
                                </a>
                                :
                                <a className="cancel_icon" href="#"
                                   onClick={(e) => {
                                       e.preventDefault();
                                       setIsEditing(false);
                                   }}
                                >
                                    <FiThumbsDown />
                                </a>
                            }
                            <p className="status">{available ? "Available" : <span className="status not_available">Not Available</span>}</p>
                            <div className="my_row button_row">
                                <button className="button green" type="submit">
                                    Save
                                </button>
                                <a href="#" className="button red" onClick={(e) => {e.preventDefault(); setIsEditing(false); }}>
                                    Cancel
                                </a>
                            </div>
                        </form>
                    </div>

                </div>
                :
                ""
            }
        </div>
    );
}

export default PageNav;
