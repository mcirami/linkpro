import React, {useState, useRef, useReducer, useEffect} from 'react';

const landingPageArray = user.landingPage;
import {Loader} from '../../Utils/Loader';
import {Flash} from '../../Utils/Flash';
import InputComponent from './Components/InputComponent';
import ColorPicker from './Components/ColorPicker';
import Preview from './Components/Preview/Preview';
import DropdownComponent from './Components/DropdownComponent';
import AddTextSection from './Components/AddTextSection';
import AddImageSection from './Components/AddImageSection';
import ImageComponent from './Components/ImageComponent';
import SectionButtonOptions from './Components/SectionButtonOptions';
import {reducer} from './Reducer';
import EventBus from '../../Utils/Bus';
import {isEmpty} from 'lodash';
import {MdDeleteForever} from 'react-icons/md';
import DeleteSection from './Components/DeleteSection';
import PreviewButton from '../Dashboard/Components/Preview/PreviewButton';
import {previewButtonRequest} from '../../Services/PageRequests';

function App() {

    //const [completedLogoCrop, setCompletedLogoCrop] = useState(null);
    //const [fileNameLogo, setFileNameLogo] = useState(null);
    //const [completedHeaderCrop, setCompletedHeaderCrop] = useState(null);
    //const [fileNameHeader, setFileNameHeader] = useState(null);

    const [pageData, dispatch] = useReducer(reducer, landingPageArray);
    const [sections, setSections] = useState(pageData["sections"]);
    const [showPreviewButton, setShowPreviewButton] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [completedCrop, setCompletedCrop] = useState([])
    const nodesRef = useRef([]);
    const [fileNames, setFileNames] = useState([]);

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

    useEffect(() => {
        previewButtonRequest(setShowPreviewButton);
    }, [])

    useEffect(() => {

        function setPreviewButton() {
            previewButtonRequest(setShowPreviewButton);
        }

        window.addEventListener('resize', setPreviewButton);

        return () => {
            window.removeEventListener('resize', setPreviewButton);
        }

    }, [])

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

            {showPreviewButton &&
                <PreviewButton setShowPreview={setShowPreview}/>
            }

            <div className="left_column">
                <h3 className="mb-4 card_title">Create Your Landing Page</h3>
                <div className="content_wrap my_row creator" id="left_col_wrap">
                    <section className="my_row section">
                        <div className="section_title">
                            <h4>Header</h4>
                        </div>
                        <div className="section_content my_row">
                            <ImageComponent
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                fileNames={fileNames}
                                setFileNames={setFileNames}
                                setShowLoader={setShowLoader}
                                pageData={pageData}
                                dispatch={dispatch}
                                elementName="logo"
                                cropArray={{
                                    unit: "%",
                                    width: 30,
                                    x: 25,
                                    y: 25,
                                    aspect: 16 / 6
                                }}
                            />
                            <InputComponent
                                placeholder="Slogan (optional)"
                                type="text"
                                maxChar={30}
                                hoverText="Submit Slogan Text"
                                elementName="slogan"
                                pageData={pageData}
                                dispatch={dispatch}
                                value={pageData["slogan"]}
                            />
                            <ImageComponent
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                fileNames={fileNames}
                                setFileNames={setFileNames}
                                setShowLoader={setShowLoader}
                                pageData={pageData}
                                dispatch={dispatch}
                                elementName="hero"
                                cropArray={{
                                    unit: "%",
                                    width: 30,
                                    x: 25,
                                    y: 25,
                                    aspect: 16 / 12
                                }}
                            />
                            <ColorPicker
                                label="Top Header Color"
                                pageData={pageData}
                                dispatch={dispatch}
                                elementName="header_color"
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
                                pageData={pageData}
                                dispatch={dispatch}
                                elementName="button_color"
                            />
                            <ColorPicker
                                label="Button Text Color"
                                pageData={pageData}
                                dispatch={dispatch}
                                elementName="button_text_color"
                            />
                            <InputComponent
                                placeholder="Update Button Text (optional)"
                                type="text"
                                maxChar={10}
                                hoverText="Submit Button Text"
                                elementName="button_text"
                                pageData={pageData}
                                value={pageData["button_text"]}
                                dispatch={dispatch}
                            />
                            <DropdownComponent />
                        </div>
                    </section>

                    {!isEmpty(sections) && sections.map((section, index) => {

                        const {id, type, text, button_position, button} = section;

                        return (
                            <section className="my_row" key={id}>
                                <div className="section_title">
                                    <h4>Section {index + 1}</h4>
                                    <DeleteSection
                                        id={id}
                                        sections={sections}
                                        setSections={setSections}
                                    />
                                </div>
                                <div className="section_content my_row">
                                    {type === "text" ?
                                        <>
                                            <InputComponent
                                                placeholder="Add Text"
                                                type="textarea"
                                                maxChar={65}
                                                hoverText={`Add Text to Section ${index + 1}`}
                                                elementName={`section_${index + 1}_text`}
                                                value={text}
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                            />
                                            <ColorPicker
                                                label="Background Color"
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                                elementName={`section_${index + 1}_bg_color`}
                                            />
                                            <ColorPicker
                                                label="Text Color"
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                                elementName={`section_${index + 1}_text_color`}
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
                                            currentSection={section}
                                            sections={sections}
                                            setSections={setSections}
                                            elementName={`section_${index + 1}_image`}
                                            cropArray={{
                                                unit: "%",
                                                width: 30,
                                                x: 25,
                                                y: 25,
                                                aspect: 16 / 12
                                            }}
                                        />
                                    }
                                    <div className="my_row button_options">
                                        <SectionButtonOptions
                                            position={index + 1}
                                            buttonPosition={button_position}
                                            includeButton={button}
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
                            pageID={pageData["id"]}
                        />
                        <AddImageSection
                            sections={sections}
                            setSections={setSections}
                            pageID={pageData["id"]}
                        />
                    </div>

                </div>
            </div>

            <div className={`right_column links_col preview  ${showPreview && "show"}`}>
                <Preview
                    completedCrop={completedCrop}
                    nodesRef={nodesRef}
                    fileNames={fileNames}
                    setFileNames={setFileNames}
                    sections={sections}
                    pageData={pageData}
                    setShowPreview={setShowPreview}
                />
            </div>

        </div>
    )
}

export default App;
