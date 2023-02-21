import {createRef, useEffect, useState} from 'react';
import {RiPagesLine, RiBarChart2Line, RiUserSettingsLine, RiMailLine, RiLogoutBoxRLine, RiInstagramLine} from 'react-icons/ri';
import {MdOutlineSchool, MdOutlineDashboard} from 'react-icons/md'
import HoverText from '../Utils/HoverText';

const landingPageData = user?.landingPageData;

function App() {

    const [isHovering, setIsHovering] = useState({
        status: false,
        section: null
    });
    const [isOpen, setIsOpen] = useState(false);

    const [creator, setCreator] = useState(null);
    const [userPermissions, setPermissions] = useState("");

    useEffect(() => {
        setCreator(window.creator)
    },[])

    useEffect(() => {

        const permissions = window.permissions.replaceAll('&quot;', '').replaceAll('[', '').replaceAll(']').replaceAll('undefined', '').split(',');
        setPermissions(permissions);

    },[])

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

        window.location = res.data.path;
    }

    return (
        <div className="menu_wrap" style={ landingPageData && { background: landingPageData["header_color"] }}>
            <div className="menu_top" style={ landingPageData && { borderColor: landingPageData["header_text_color"] }}>
                <div className="logo">
                    {landingPageData ?
                        <img src={landingPageData["logo"]} alt=""/>
                        :
                        <img src={Vapor.asset('images/logo-white.png')} alt=""/>
                    }
                </div>
                <a className="icon_wrap mobile_menu_icon"
                   href="#"
                   onClick={(e) => handleOnClick(e)}>
                    <span
                        style={ landingPageData && { background: landingPageData["header_text_color"] }}
                    ></span>
                    <span
                        style={ landingPageData && { background: landingPageData["header_text_color"] }}
                    ></span>
                    <span
                        style={ landingPageData && { background: landingPageData["header_text_color"] }}
                    ></span>
                </a>
            </div>
            <div className="menu">
                <ul>
                    {userPermissions.includes('view dashboard') &&
                        <li>
                            <a style={ landingPageData && { color: landingPageData["header_text_color"] }}
                               id="pages"
                               className="menu-item"
                               href="/dashboard/pages/"
                               onMouseOver={() => handleMouseOver("pages")}
                               onMouseOut={handleMouseOut}>
                                <span className="menu_icon" style={ landingPageData && { color: landingPageData["header_text_color"] }}>
                                    <RiPagesLine/>
                                </span>
                                Pages
                            </a>
                            {!isOpen && isHovering.status &&
                            isHovering.section === "pages" ?
                                <HoverText text="pages"/>
                                :
                                ""
                            }
                        </li>
                    }
                    {userPermissions.includes('view stats') &&
                        <li>
                            <a style={ landingPageData && { color: landingPageData["header_text_color"] }}
                               id="stats"
                               className="menu-item"
                               href="/stats/"
                               onMouseOver={() => handleMouseOver("stats")}
                               onMouseOut={handleMouseOut}>
                            <span className="menu_icon" style={ landingPageData && { color: landingPageData["header_text_color"] }}>
                                <RiBarChart2Line/>
                            </span>
                                Stats
                            </a>
                            {!isOpen && isHovering.status &&
                            isHovering.section === "stats" ?
                                <HoverText text="stats"/>
                                :
                                ""
                            }
                        </li>
                    }
                    {userPermissions.includes('view course manager') &&
                        <li>
                            <a style={ landingPageData && { color: landingPageData["header_text_color"] }}
                               id="course_manager"
                               className="menu-item"
                               href="/course-manager"
                               onMouseOver={() => handleMouseOver(
                                   "course manager")}
                               onMouseOut={handleMouseOut}>
                            <span className="menu_icon" style={ landingPageData && { color: landingPageData["header_text_color"] }}>
                                <MdOutlineDashboard />
                            </span>
                                Course Manager
                            </a>
                            {!isOpen && isHovering.status &&
                            isHovering.section === "course manager" ?
                                <HoverText text="course manager"/>
                                :
                                ""
                            }
                        </li>
                    }
                    {userPermissions.includes("view courses") &&
                        <li>
                            <a style={{ color: landingPageData && landingPageData["header_text_color"] }}
                               id="course_manager"
                               className="menu-item"
                               href={`/${creator}/courses`}
                               onMouseOver={() => handleMouseOver("courses")}
                               onMouseOut={handleMouseOut}>
                                <span className="menu_icon" style={ landingPageData && { color: landingPageData["header_text_color"]}
                                }>
                                    <MdOutlineSchool/>
                                </span>
                                Courses
                            </a>
                            {!isOpen && isHovering.status &&
                            isHovering.section === "courses" ?
                                <HoverText text="courses"/>
                                :
                                ""
                            }
                        </li>
                    }
                    <li>
                        <a style={{ color: landingPageData && landingPageData["header_text_color"] }}
                           id="settings"
                           className="menu-item"
                           href="/edit-account"
                           onMouseOver={() => handleMouseOver("settings")}
                           onMouseOut={handleMouseOut}>
                            <span className="menu_icon" style={ landingPageData && { color: landingPageData["header_text_color"] }}>
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
                    {!creator &&
                        <li>
                            <a id="contact"
                               className="menu-item"
                               href="/contact"
                               onMouseOver={() => handleMouseOver("contact us")}
                               onMouseOut={handleMouseOut}
                               style={{ color: landingPageData && landingPageData["header_text_color"] }}
                            >
                                <span className="menu_icon" style={{ color: landingPageData && landingPageData["header_text_color"] }}>
                                    <RiMailLine/>
                                </span>
                                Contact Us
                            </a>
                            {!isOpen && isHovering.status &&
                            isHovering.section === "contact us" ?
                                <HoverText text="contact us"/>
                                :
                                ""
                            }
                        </li>
                    }
                    <li>
                        <a style={{ color: landingPageData && landingPageData["header_text_color"] }}
                           id="logout"
                           href="#"
                           onClick={(e) => handleSubmit(e)}
                           onMouseOver={() => handleMouseOver("logout")}
                           onMouseOut={handleMouseOut}>
                            <span className="menu_icon" style={ landingPageData && { color: landingPageData["header_text_color"] }}>
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
                        {creator ?
                            <li>
                                <a href={`${window.location.origin}/${creator}`}
                                   style={{ color: landingPageData && landingPageData["header_text_color"] }}
                                   target="_blank"
                                   onMouseOver={() => handleMouseOver(
                                       "contact " + creator)}
                                   onMouseOut={handleMouseOut}>
                                    <span className="menu_icon">
                                        <svg viewBox="0 0 15.82 15.82" xmlns="http://www.w3.org/2000/svg" style={{ color: landingPageData && landingPageData["header_text_color"] }}>
                                            <g fill="currentColor" transform="translate(-.1 -.12)">
                                                <path d="m8 15.94a7.91 7.91 0 1 1 7.92-7.94 7.92 7.92 0 0 1 -7.92 7.94zm0-14.11a6.2 6.2 0 1 0 6.21 6.17 6.21 6.21 0 0 0 -6.21-6.17z"/>
                                                <path d="m12.93 6.6a3.28 3.28 0 0 0 -.27-.38 2.66 2.66 0 0 0 -2.16-.9 2.52 2.52 0 0 0 -2 1.26.21.21 0 0 0 0 .1.26.26 0 0 0 .08.13 2.82 2.82 0 0 0 .8.66 1.44 1.44 0 0 0 1.15 0l-.64-.58a.47.47 0 0 1 -.06-.09.15.15 0 0 1 .09-.14 1.44 1.44 0 0 1 1.56-.05 1.51 1.51 0 0 1 .24 2.28 1.4 1.4 0 0 1 -1.84.11c-.96-1-1.94-1.89-2.83-2.89a2.55 2.55 0 1 0 -1.29 4.22 2.44 2.44 0 0 0 1.68-1.33c-.89-.93-1.1-1-2.09-.82l.65.57c.11.1.15.19 0 .3a1.54 1.54 0 0 1 -1.81-.19 1.5 1.5 0 0 1 0-2.09 1.46 1.46 0 0 1 2 .06c.23.22.45.46.68.69.79.79 1.53 1.63 2.38 2.35a2.49 2.49 0 0 0 3.68-3.27z"/>
                                            </g>
                                        </svg>
                                    </span>
                                    Contact <span>{creator}</span>
                                </a>
                                {!isOpen && isHovering.status &&
                                isHovering.section === "follow us" ?
                                    <HoverText text="follow us"/>
                                    :
                                    ""
                                }
                            </li>
                            :
                            <li>
                                <a href="https://www.instagram.com/link.pro.official/"
                                   target="_blank"
                                   onMouseOver={() => handleMouseOver(
                                       "follow us")}
                                   onMouseOut={handleMouseOut}>
                                <span className="menu_icon">
                                    <RiInstagramLine/>
                                </span>
                                    Follow Us
                                </a>
                                {!isOpen && isHovering.status &&
                                isHovering.section === "follow us" ?
                                    <HoverText text="follow us"/>
                                    :
                                    ""
                                }
                            </li>
                        }
                    </ul>
                </div>
            </div>
        </div>

    )
}

export default App;
