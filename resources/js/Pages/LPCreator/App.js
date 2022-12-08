import React, {useState, createRef, useRef} from 'react';

import Logo from './Components/Logo';
import {Loader} from '../../Utils/Loader';
import {Flash} from '../../Utils/Flash';
import InputComponent from './Components/InputComponent';
import HeaderImage from './Components/HeaderImage';
import ColorPicker from './Components/ColorPicker';
import Preview from './Components/Preview/Preview';
import DropdownComponent from './Components/DropdownComponent';

function App() {

    //const [completedLogoCrop, setCompletedLogoCrop] = useState(null);
    const [fileNameLogo, setFileNameLogo] = useState(null);
    //const [completedHeaderCrop, setCompletedHeaderCrop] = useState(null);
    const [fileNameHeader, setFileNameHeader] = useState(null);

    const [completedCrop, setCompletedCrop] = useState([])
    const nodesRef = useRef([]);
    const [fileName, setFileName] = useState([]);
    const [colors, setColors] = useState([]);

    const [showLoader, setShowLoader] = useState(false);
    const [flash, setFlash] = useState({
        show: false,
        type: '',
        msg: ''
    });

    console.log("completedCrop: ", completedCrop);
    console.log("nodedRef: ", nodesRef.current["header"]);

    const showFlash = (show = false, type='', msg='') => {
        setFlash({show, type, msg})
    }

    console.log(colors)
    
    return (
        <div className="my_row page_wrap">

            {showLoader &&
                <Loader />
            }

            {flash.show &&
                <Flash
                    {...flash}
                    setFlash={setFlash}
                    removeFlash={showFlash}
                    pageSettings={pageSettings}
                />
            }

            <div className="left_column">
                <h3 className="mb-3">Create Your Landing Page</h3>
                <div className="content_wrap my_row creator" id="left_col_wrap">
                    <section className="my_row section">
                        <div className="section_title">
                            <h4>Header</h4>
                        </div>
                        <div className="section_content my_row">
                            <Logo
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                fileName={fileNameLogo}
                                setFileName={setFileNameLogo}
                                setShowLoader={setShowLoader}

                            />
                            <InputComponent
                                placeholder="Slogan (optional)"
                                type="slogan"
                                maxChar={30}
                                hoverText="Submit Slogan Text"
                            />
                            <HeaderImage
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                fileName={fileNameHeader}
                                setFileName={setFileNameHeader}
                                setShowLoader={setShowLoader}
                            />
                            <ColorPicker
                                label="Top Header Color"
                                colors={colors}
                                setColors={setColors}
                                type={"headerBg"}
                            />
                        </div>
                    </section>

                    <section className="my_row">
                        <div className="section_title">
                            <h4>Buttons</h4>
                        </div>
                        <div className="section_content my_row">
                            <ColorPicker
                                label="Button Color"
                                colors={colors}
                                setColors={setColors}
                                type={"buttonBg"}
                            />
                            <ColorPicker
                                label="Button Text Color"
                                colors={colors}
                                setColors={setColors}
                                type={"buttonText"}
                            />
                            <InputComponent
                                placeholder="Update Button Text (optional)"
                                type="buttonText"
                                maxChar={10}
                                hoverText="Submit Button Text"
                            />
                            <DropdownComponent />
                        </div>
                    </section>
                </div>
            </div>

            <div className={`right_column links_col preview`}>
                <Preview
                    completedCrop={completedCrop}
                    setCompletedCrop={setCompletedCrop}
                    nodesRef={nodesRef}
                    fileNameLogo={fileNameLogo}
                    fileNameHeader={fileNameHeader}
                    colors={colors}
                />
            </div>

        </div>
    )
}

export default App;
