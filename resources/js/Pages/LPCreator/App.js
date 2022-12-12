import React, {useState, createRef, useRef} from 'react';

import Logo from './Components/Logo';
import {Loader} from '../../Utils/Loader';
import {Flash} from '../../Utils/Flash';
import InputComponent from './Components/InputComponent';
import HeaderImage from './Components/HeaderImage';
import ColorPicker from './Components/ColorPicker';
import Preview from './Components/Preview/Preview';
import DropdownComponent from './Components/DropdownComponent';
import sectionData from './Components/SectionData';

function App() {

    //const [completedLogoCrop, setCompletedLogoCrop] = useState(null);
    //const [fileNameLogo, setFileNameLogo] = useState(null);
    //const [completedHeaderCrop, setCompletedHeaderCrop] = useState(null);
    //const [fileNameHeader, setFileNameHeader] = useState(null);

    const [completedCrop, setCompletedCrop] = useState([])
    const nodesRef = useRef([]);
    const [fileNames, setFileNames] = useState([]);
    const [colors, setColors] = useState([]);
    const [textArray, setTextArray] = useState([]);

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

    console.log("colors: ", colors)

    console.log("filenames: " , fileNames)

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
                            TODO: change to a Dynamic image component
                            <Logo
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                fileNames={fileNames}
                                setFileNames={setFileNames}
                                setShowLoader={setShowLoader}
                                elementName="logo"
                            />
                            <InputComponent
                                placeholder="Slogan (optional)"
                                type="text"
                                maxChar={30}
                                hoverText="Submit Slogan Text"
                                elementName="slogan"
                                setTextArray={setTextArray}
                            />
                            TODO: change to a Dynamic image component
                            <HeaderImage
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                fileNames={fileNames}
                                setFileNames={setFileNames}
                                setShowLoader={setShowLoader}
                                elementName="header"
                            />
                            <ColorPicker
                                label="Top Header Color"
                                colors={colors}
                                setColors={setColors}
                                elementName="headerBg"
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
                                elementName="buttonBg"
                            />
                            <ColorPicker
                                label="Button Text Color"
                                colors={colors}
                                setColors={setColors}
                                elementName="buttonText"
                            />
                            <InputComponent
                                placeholder="Update Button Text (optional)"
                                type="text"
                                maxChar={10}
                                hoverText="Submit Button Text"
                                elementName="buttonText"
                                setTextArray={setTextArray}
                            />
                            <DropdownComponent />
                        </div>
                    </section>

                    {sectionData?.map((data) => {

                        const {type, bgColor, textColor, position, text} = data;

                        return (
                            <section className="my_row" key={position}>
                                <div className="section_title">
                                    <h4>Section {position}</h4>
                                </div>
                                <div className="section_content my_row">
                                    {type === "text" ?
                                        <>
                                            <InputComponent
                                                placeholder="Add Text"
                                                type="textarea"
                                                maxChar={65}
                                                hoverText={`Add Text to Section ${position}`}
                                                elementName={`section${position}Text`}
                                                value={text}
                                                setTextArray={setTextArray}
                                            />
                                            <ColorPicker
                                                label="Background Color"
                                                colors={colors}
                                                setColors={setColors}
                                                bgColor={bgColor}
                                                elementName={`section${position}BgColor`}
                                            />
                                            <ColorPicker
                                                label="Text Color"
                                                colors={colors}
                                                setColors={setColors}
                                                textColor={textColor}
                                                elementName={`section${position}TextColor`}
                                            />
                                        </>
                                        :
                                        /* TODO: change to a Dynamic image component */
                                        <Logo
                                            nodesRef={nodesRef}
                                            completedCrop={completedCrop}
                                            setCompletedCrop={setCompletedCrop}
                                            fileName={fileNameLogo}
                                            setFileName={setFileNameLogo}
                                            setShowLoader={setShowLoader}
                                        />
                                    }
                                </div>
                            </section>
                        )
                    })}

                </div>
            </div>

            <div className={`right_column links_col preview`}>
                <Preview
                    completedCrop={completedCrop}
                    nodesRef={nodesRef}
                    fileNames={fileNames}
                    colors={colors}
                    sectionData={sectionData}
                    textArray={textArray}
                />
            </div>

        </div>
    )
}

export default App;
