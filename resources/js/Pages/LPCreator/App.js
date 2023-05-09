import React, {useState, useRef, useReducer, useEffect} from 'react';

const landingPageArray = user.landingPage;
const courses = user.courses;
const username = user.username;
import {Loader} from '../../Utils/Loader';
import {Flash} from '../../Utils/Flash';
import InputComponent from './Components/InputComponent';
import ColorPicker from './Components/ColorPicker';
import Preview from './Components/Preview/Preview';
import AddTextSection from './Components/AddTextSection';
import AddImageSection from './Components/AddImageSection';
import ImageComponent from './Components/ImageComponent';
import SectionButtonOptions from './Components/SectionButtonOptions';
import {reducer} from './Reducer';
import EventBus from '../../Utils/Bus';
import {isEmpty} from 'lodash';
import DeleteSection from './Components/DeleteSection';
import PreviewButton from '../Dashboard/Components/Preview/PreviewButton';
import {previewButtonRequest} from '../../Services/PageRequests';
import PublishButton from './Components/PublishButton';
import InfoText from './Components/InfoText';
import {MdKeyboardArrowDown} from 'react-icons/md';

function App() {

    const [openIndex, setOpenIndex] = useState([0]);

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

    const handleSectionOpen = (rowIndex) => {
        if(openIndex.includes(rowIndex)) {
            const newArrayIndex = openIndex.filter(element => element !== rowIndex)
            setOpenIndex(newArrayIndex)
        } else {
            const newArrayIndex = openIndex.concat(rowIndex);
            setOpenIndex(newArrayIndex);
        }
    }

    const url = window.location.protocol + "//" + window.location.host + "/" + username;

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
                    <section className="my_row section_row">
                        <div className="section_title">
                            <h4>Title</h4>
                        </div>
                        <div className="section_content my_row">
                            <InputComponent
                                placeholder="Page Title"
                                type="text"
                                maxChar={60}
                                hoverText="Submit Page Title"
                                elementName="title"
                                data={pageData}
                                dispatch={dispatch}
                                value={pageData["title"]}
                            />
                            {pageData["slug"] &&
                                <div className="url_wrap">
                                    <p>Landing Page URL:</p>
                                    <a target="_blank" href={`${url}/${pageData["slug"]}`}>{`${url}/${pageData["slug"]}`}</a>
                                </div>
                            }
                        </div>
                    </section>
                    <section className="my_row section section_row">
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
                                    width: 60,
                                    height: 30,
                                    x: 25,
                                    y: 25,
                                }}
                            />
                            <InputComponent
                                placeholder="Slogan (optional)"
                                type="text"
                                maxChar={30}
                                hoverText="Submit Slogan Text"
                                elementName="slogan"
                                data={pageData}
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
                                    aspect: 16 / 8
                                }}
                            />
                            <div className="picker_wrap">
                                <ColorPicker
                                    label="Top Header Color"
                                    pageData={pageData}
                                    dispatch={dispatch}
                                    elementName="header_color"
                                />
                                <InfoText section="header_color" />
                            </div>
                            <div className="picker_wrap">
                                <ColorPicker
                                    label="Header Text Color"
                                    pageData={pageData}
                                    dispatch={dispatch}
                                    elementName="header_text_color"
                                />
                                <InfoText section="header_text_color"/>
                            </div>
                        </div>
                    </section>

                    <section className="my_row section_row">
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
                                data={pageData}
                                value={pageData["button_text"]}
                                dispatch={dispatch}
                            />
                        </div>
                    </section>

                    {!isEmpty(sections) &&

                        <section className="sections_wrap my_row">

                            {sections.map((section, index) => {

                                const {id, type, text, button_position, button, button_link} = section;

                                return (

                                    <div className="section_row" key={id}>
                                        <div className="section_title" onClick={(e) => handleSectionOpen(index)}>
                                            <div className="left_column">
                                                <h4>Section {index + 1}</h4>
                                                <DeleteSection
                                                    id={id}
                                                    sections={sections}
                                                    setSections={setSections}
                                                />
                                            </div>
                                            <div className={`icon_wrap ${openIndex.includes(index) ? "open" : ""}`}>
                                                <MdKeyboardArrowDown />
                                            </div>
                                        </div>
                                        <div className={`section_content my_row ${openIndex.includes(index) ? "open" : ""}`}>
                                            {type === "text" &&
                                                <>
                                                    <InputComponent
                                                        placeholder="Add Text"
                                                        type="textarea"
                                                        hoverText={`Add Text to Section ${index +
                                                        1}`}
                                                        elementName={`section_${index +
                                                        1}_text`}
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
                                                        elementName={`section_${index +
                                                        1}_bg_color`}
                                                    />
                                                    {/* <ColorPicker
                                                        label="Text Color"
                                                        currentSection={section}
                                                        sections={sections}
                                                        setSections={setSections}
                                                        elementName={`section_${index + 1}_text_color`}
                                                    />*/}
                                                </>
                                            }
                                            {type === "image" &&
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
                                                        aspect: 16 / 8
                                                    }}
                                                />
                                            }
                                            <div className="my_row">
                                                <SectionButtonOptions
                                                    position={index + 1}
                                                    buttonPosition={button_position}
                                                    includeButton={button}
                                                    sections={sections}
                                                    setSections={setSections}
                                                    button_link={button_link}
                                                    courses={courses}
                                                    id={id}
                                                    url={url}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </section>
                    }

                    <div className="link_row">
                        <AddTextSection
                            sections={sections}
                            setSections={setSections}
                            pageID={pageData["id"]}
                            setOpenIndex={setOpenIndex}
                        />
                        <AddImageSection
                            sections={sections}
                            setSections={setSections}
                            pageID={pageData["id"]}
                            setOpenIndex={setOpenIndex}
                        />
                    </div>

                    {!pageData["published"] &&

                        <PublishButton
                            pageData={pageData}
                            dispatch={dispatch}
                        />
                    }
                </div>
            </div>

            <div className={`right_column links_col preview${showPreview ? " show" : ""}`}>
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
