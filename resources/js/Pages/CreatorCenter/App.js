import React, {useRef, useState} from 'react';
import { ToolTipContextProvider } from '../../Utils/ToolTips/ToolTipContext';
import TableComponent from './Components/TableComponent';
import {FaPlus} from 'react-icons/fa';
import ToolTipIcon from '../../Utils/ToolTips/ToolTipIcon';
import IOSSwitch from '../../Utils/IOSSwitch';
import {activatePage} from '../../Services/LandingPageRequests';
import Preview from './Components/Preview';

const offers = user.offers;
const landingPage = user.landingPage;
function App() {

    const [infoText, setInfoText] = useState({section:'', text:[]});
    const [infoTextOpen, setInfoTextOpen] = useState(false)
    const [infoLocation, setInfoLocation] = useState({})
    const [infoClicked, setInfoClicked] = useState(null);

    const [lpActive, setLpActive] = useState(landingPage ? landingPage['active'] : null);

    const handleChange = () => {

        activatePage(landingPage["id"])
        .then((response) => {
            if (response.success) {
                //setLpActive(!lpActive);
            }
        });
    }



    return (
        <ToolTipContextProvider value={{
            infoText,
            setInfoText,
            infoTextOpen,
            setInfoTextOpen,
            infoLocation,
            setInfoLocation,
            infoClicked,
            setInfoClicked
        }}>
            {offers.length === 0 ?
                <>
                    <h3>Become a LinkPro Course Creator to generate revenue from your social following and beyond!</h3>
                    <ul>
                        <li>
                            <span className="number">1</span>
                            <div className="text_wrap">
                                <h4>Add A Course</h4>
                                <p>Create and upload your proprietary Course videos and charge for customers to access your content.</p>
                            </div>
                        </li>
                        <li>
                            <span className="number">2</span>
                            <div className="text_wrap">
                                <h4>Create A Landing Page</h4>
                                <p>A Landing Page is your exclusive page and link you build to help market the Courses you create.</p>
                            </div>
                        </li>
                        <li>
                            <span className="number">3</span>
                            <div className="text_wrap">
                                <h4>Promote your Course link and get paid!</h4>
                                <p>Publish and market your Course to generate income. Recruit others to sell your Course to earn shared profits!</p>
                            </div>
                        </li>
                    </ul>
                    <a className="button blue full" href="/creator-center/add-course">
                        Get Started!
                    </a>
                </>
                :
                <div className="grid_columns">
                    <div className="column">
                        <div className="column_title">
                            <h3>
                                <span>Landing Page</span>
                                <ToolTipIcon section="creator_lp" />
                            </h3>
                        </div>
                        {landingPage ?
                            <Preview
                                landingPage={landingPage}
                            />
                            :
                            <div className="image_wrap">
                                <img src={Vapor.asset('images/blank-lp.png')} alt=""/>
                            </div>
                        }
                        <div className="buttons_wrap my_row">
                            <div className="button_wrap">
                                <a className="button blue"
                                   href={landingPage ? `/creator-center/landing-page/${landingPage["id"]}` : '/creator-center/add-landing-page'}>
                                    {landingPage ? "Edit" : "Create"}
                                </a>
                            </div>
                           <div className="switch_wrap">
                               <h5>Active</h5>
                               <IOSSwitch
                                   onChange={handleChange}
                                   disabled={landingPage && landingPage['published'] ? Boolean(0) : Boolean(1)}
                                   checked={lpActive}
                                />
                           </div>
                        </div>

                    </div>
                    <div className="column">
                        <div className="column_title">
                            <h3>
                                Courses
                                <ToolTipIcon section="creator_course" />
                            </h3>
                        </div>

                        <TableComponent offers={offers}/>

                        <div className="link_wrap my_row">
                            <a className="blue" href="/creator-center/add-course">
                                <FaPlus />
                                Add New Course
                            </a>
                        </div>
                    </div>
                </div>
            }

        </ToolTipContextProvider>
    )
}

export default App;
