import {createRef, useEffect, useState} from 'react';
import {RiPagesLine, RiBarChart2Line, RiUserSettingsLine, RiMailLine, RiLogoutBoxRLine, RiInstagramLine} from 'react-icons/ri';
import {MdOutlineSchool} from 'react-icons/md'
import HoverText from '../Utils/HoverText';

function App() {

    const [isHovering, setIsHovering] = useState({
        status: false,
        section: null
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleOnClick = (e) => {
        e.preventDefault();
        setIsOpen(!isOpen);
        const pageWrapper = document.getElementById("off_canvas_menu");
        if (!!isOpen) {
            pageWrapper.classList.remove("open");
        } else {
            pageWrapper.classList.add("open");
        }
    }

    const handleMouseOver = (section) => {
        setIsHovering({
            status: true,
            section: section
        })
    }

    const handleMouseOut = () => {
        setIsHovering({
            status: false,
            section: null
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post('/logout', {
            headers: {
                // 'application/json' is the modern content-type for JSON, but some
                // older servers may use 'text/json'.
                // See: http://bit.ly/text-json
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });

        window.location = "/";
    }

    return (
        <div className="menu_wrap">
            <div className="menu_top">
                <div className="logo">
                    <img src={Vapor.asset('images/logo-white.png')} alt=""/>
                </div>
                <a className="icon_wrap mobile_menu_icon"
                   href="#"
                   onClick={(e) => handleOnClick(e)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </a>
            </div>
            <div className="menu">
                <ul>
                    <li>
                        <a id="pages"
                           className="menu-item"
                           href="/dashboard/pages/"
                           onMouseOver={() => handleMouseOver("pages")}
                           onMouseOut={handleMouseOut}>
                            <span className="menu_icon">
                                <RiPagesLine />
                            </span>
                            Pages
                        </a>
                        {!isOpen && isHovering.status && isHovering.section === "pages" ?
                            <HoverText text="pages"/>
                            :
                            ""
                        }
                    </li>
                    <li>
                        <a id="stats"
                           className="menu-item"
                           href="/stats/"
                           onMouseOver={() => handleMouseOver("stats")}
                           onMouseOut={handleMouseOut}>
                            <span className="menu_icon">
                                <RiBarChart2Line />
                            </span>
                            Stats
                        </a>
                        {!isOpen && isHovering.status && isHovering.section === "stats" ?
                            <HoverText text="stats"/>
                            :
                            ""
                        }
                    </li>
                    <li>
                        <a id="course_manager"
                           className="menu-item"
                           href="/course-manager"
                           onMouseOver={() => handleMouseOver("course manager")}
                           onMouseOut={handleMouseOut}>
                            <span className="menu_icon">
                                <MdOutlineSchool />
                            </span>
                            Course Manager
                        </a>
                        {!isOpen && isHovering.status && isHovering.section === "course manager" ?
                            <HoverText text="course manager"/>
                            :
                            ""
                        }
                    </li>
                    <li>
                        <a id="settings"
                           className="menu-item"
                           href="/edit-account"
                           onMouseOver={() => handleMouseOver("settings")}
                           onMouseOut={handleMouseOut}>
                            <span className="menu_icon">
                                <RiUserSettingsLine />
                            </span>
                            Settings
                        </a>
                        {!isOpen && isHovering.status && isHovering.section === "settings" ?
                            <HoverText text="settings"/>
                            :
                            ""
                        }
                    </li>
                    <li>
                        <a id="contact"
                           className="menu-item"
                           href="/contact"
                           onMouseOver={() => handleMouseOver("contact us")}
                           onMouseOut={handleMouseOut}>
                            <span className="menu_icon">
                                <RiMailLine />
                            </span>
                            Contact Us
                        </a>
                        {!isOpen && isHovering.status && isHovering.section === "contact us" ?
                            <HoverText text="contact us"/>
                            :
                            ""
                        }
                    </li>
                    <li>
                        <a id="logout"
                           href="#"
                           onClick={(e) => handleSubmit(e)}
                           onMouseOver={() => handleMouseOver("logout")}
                           onMouseOut={handleMouseOut}>
                            <span className="menu_icon">
                                <RiLogoutBoxRLine />
                            </span>
                            Logout
                        </a>
                        {!isOpen && isHovering.status && isHovering.section === "logout" ?
                            <HoverText text="logout"/>
                            :
                            ""
                        }
                    </li>
                </ul>
            </div>
            <div className="menu_bottom">
                <div className="menu">
                    <ul>
                        <li>
                            <a href="https://www.instagram.com/link.pro.official/"
                               target="_blank"
                               onMouseOver={() => handleMouseOver("follow us")}
                               onMouseOut={handleMouseOut}>
                                <span className="menu_icon">
                                    <RiInstagramLine />
                                </span>
                                Follow Us
                            </a>
                            {!isOpen && isHovering.status && isHovering.section === "follow us" ?
                                <HoverText text="follow us"/>
                                :
                                ""
                            }
                        </li>
                        {/*<li>
                            <a href="mailto:support@link.pro">help@link.pro</a>
                        </li>*/}
                    </ul>
                </div>
            </div>
        </div>

    )
}

export default App;
