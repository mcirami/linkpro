import React, {useState, useRef, useReducer, useEffect} from 'react';

const landingPageArray = user.landingPage;
import Logo from './Components/Logo';
import {Loader} from '../../Utils/Loader';
import {Flash} from '../../Utils/Flash';
import InputComponent from './Components/InputComponent';
import HeaderImage from './Components/HeaderImage';
import ColorPicker from './Components/ColorPicker';
import Preview from './Components/Preview/Preview';
import DropdownComponent from './Components/DropdownComponent';
import sectionData from './Components/SectionData';
import AddTextSection from './Components/AddTextSection';
import AddImageSection from './Components/AddImageSection';
import ImageComponent from './Components/ImageComponent';
import SectionButtonOptions from './Components/SectionButtonOptions';
import {reducer} from './Reducer';
import EventBus from '../../Utils/Bus';

function App() {

    //const [completedLogoCrop, setCompletedLogoCrop] = useState(null);
    //const [fileNameLogo, setFileNameLogo] = useState(null);
    //const [completedHeaderCrop, setCompletedHeaderCrop] = useState(null);
    //const [fileNameHeader, setFileNameHeader] = useState(null);

    const [pageData, dispatch] = useReducer(reducer, landingPageArray);

    const [sections, setSections] = useState(sectionData);
    const [completedCrop, setCompletedCrop] = useState([])
    const nodesRef = useRef([]);
    const [fileNames, setFileNames] = useState([]);
    const [colors, setColors] = useState([]);
    const [textArray, setTextArray] = useState([]);

    const [showLoader, setShowLoader] = useState({
        show: false,
        icon: "",
        position: ""
    });
    const [flash, setFlash] = useState({
        show: false,
        type: '',
        msg: ''
    });

    const showFlash = (show = false, type='', msg='') => {
        setFlash({show, type, msg})
    }

    useEffect(() => {
        EventBus.on('success', (data) => {
            showFlash(true, 'success', data.message.replace(/"/g, ""))

            return () => EventBus.remove("success");
        });

    }, []);

    useEffect(() => {
        EventBus.on('error', (data) => {
            showFlash(true, 'error', data.message.replace(/"/g, ""))

            return () => EventBus.remove("error");
        });

    }, []);

    /*console.log("completedCrop: ", completedCrop);
    console.log("nodedRef: ", nodesRef);
    console.log("colors: ", colors)*/
   /* console.log("filenames: " , fileNames)*/

    return (
        <div className="my_row page_wrap">

            {showLoader.show &&
                <Loader
                    showLoader={showLoader}
                />
            }

            {flash.show &&
                <Flash
                    {...flash}
                    setFlash={setFlash}
                    removeFlash={showFlash}
                    pageSettings={pageData}
                />
            }

            <div className="left_column">
                <h3 className="mb-4 card_title">Create Your Landing Page</h3>
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
                                pageID={pageData["id"]}
                                dispatch={dispatch}
                                elementName="logo"
                            />
                            <InputComponent
                                placeholder="Slogan (optional)"
                                type="text"
                                maxChar={30}
                                hoverText="Submit Slogan Text"
                                elementName="slogan"
                                pageID={pageData["id"]}
                                textArray={textArray}
                                setTextArray={setTextArray}
                                dispatch={dispatch}
                            />
                            TODO: change to a Dynamic image component
                            <HeaderImage
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                fileNames={fileNames}
                                setFileNames={setFileNames}
                                setShowLoader={setShowLoader}
                                elementName="hero"
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

                    {sections?.map((data, index) => {

                        const {id, type, bgColor, textColor, text, buttonPosition, includeButton} = data;

                        return (
                            <section className="my_row" key={id}>
                                <div className="section_title">
                                    <h4>Section {index + 1}</h4>
                                </div>
                                <div className="section_content my_row">
                                    {type === "text" ?
                                        <>
                                            <InputComponent
                                                placeholder="Add Text"
                                                type="textarea"
                                                maxChar={65}
                                                hoverText={`Add Text to Section ${index + 1}`}
                                                elementName={`section${index + 1}Text`}
                                                value={text}
                                                setTextArray={setTextArray}
                                            />
                                            <ColorPicker
                                                label="Background Color"
                                                colors={colors}
                                                setColors={setColors}
                                                bgColor={bgColor}
                                                elementName={`section${index + 1}BgColor`}
                                            />
                                            <ColorPicker
                                                label="Text Color"
                                                colors={colors}
                                                setColors={setColors}
                                                textColor={textColor}
                                                elementName={`section${index + 1}TextColor`}
                                            />
                                        </>
                                        :
                                        <ImageComponent
                                            nodesRef={nodesRef}
                                            completedCrop={completedCrop}
                                            setCompletedCrop={setCompletedCrop}
                                            fileNames={fileNames}
                                            setFileNames={setFileNames}
                                            setShowLoader={setShowLoader}
                                            elementName={`section${index + 1}image`}
                                        />
                                    }
                                    <div className="my_row button_options">
                                        <SectionButtonOptions
                                            position={index + 1}
                                            buttonPosition={buttonPosition}
                                            includeButton={includeButton}
                                            sections={sections}
                                            setSections={setSections}
                                            id={id}
                                        />
                                    </div>
                                </div>
                            </section>
                        )
                    })}

                    <div className="link_row">
                        <AddTextSection
                            sections={sections}
                            setSections={setSections}
                        />
                        <AddImageSection
                            sections={sections}
                            setSections={setSections}
                        />
                    </div>

                </div>
            </div>

            <div className={`right_column links_col preview`}>
                <Preview
                    completedCrop={completedCrop}
                    nodesRef={nodesRef}
                    fileNames={fileNames}
                    setFileNames={setFileNames}
                    colors={colors}
                    sections={sections}
                    textArray={textArray}
                    pageData={pageData}
                />
            </div>

        </div>
    )
}

export default App;
