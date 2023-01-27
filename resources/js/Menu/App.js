/*import {slide as Menu} from 'react-burger-menu';*/
import {GiHamburgerMenu} from 'react-icons/gi';
import {createRef, useEffect} from 'react';
import {RiPagesLine, RiBarChart2Line, RiUserSettingsLine, RiMailLine, RiLogoutBoxRLine, RiInstagramLine} from 'react-icons/ri';

function App() {

    const menuWrap = createRef();
    const mobileIcon = createRef();

    const handleOnClick = (e) => {
        e.preventDefault();
        const pageWrapper = document.getElementById("off_canvas_menu");
        if (menuWrap.current.classList.contains('open')) {
            menuWrap.current.classList.remove("open");
            pageWrapper.classList.remove("open");
            mobileIcon.current.classList.remove("open");
        } else {
            menuWrap.current.classList.add("open");
            pageWrapper.classList.add("open");
            mobileIcon.current.classList.add("open");
        }

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
        <div className="menu_wrap" ref={menuWrap}>
            <div className="menu_top">
                <div className="logo">
                    <img src={Vapor.asset('images/logo-white.png')} alt=""/>
                </div>
                <a className="icon_wrap mobile_menu_icon" href="#" onClick={(e) => handleOnClick(e)} ref={mobileIcon} >
                    <span></span>
                    <span></span>
                    <span></span>
                </a>
            </div>
            <div className="menu">
                <ul>
                    <li>
                        <a id="pages" className="menu-item" href="/dashboard/pages/">
                            <RiPagesLine />
                            Pages
                        </a>
                    </li>
                    <li>
                        <a id="stats" className="menu-item" href="/stats/">
                            <RiBarChart2Line />
                            Stats
                        </a>
                    </li>
                    <li>
                        <a id="settings" className="menu-item" href="/edit-account">
                            <RiUserSettingsLine />
                            Settings
                        </a>
                    </li>
                    <li>
                        <a id="contact" className="menu-item" href="/contact">
                            <RiMailLine />
                            Contact Us
                        </a>
                    </li>
                    <li>
                        <a id="logout" href="#" onClick={(e) => handleSubmit(e)}>
                            <RiLogoutBoxRLine /> Logout
                        </a>
                    </li>
                </ul>
            </div>
            <div className="menu_bottom">
                <div className="menu">
                    <ul>
                        <li>
                            <a href="https://www.instagram.com/link.pro.official/" target="_blank">
                                <RiInstagramLine />
                                Follow Us
                            </a>
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
