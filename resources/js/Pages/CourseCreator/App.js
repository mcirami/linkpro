import React, {useState, useRef, useReducer, useEffect} from 'react';

const courseArray = user.courseData;
const offerArray = user.offerData;
const username = user.username;

import {Loader} from '../../Utils/Loader';
import {Flash} from '../../Utils/Flash';
import InputComponent from './Components/InputComponent';
import ColorPicker from './Components/ColorPicker';
import Preview from './Components/Preview/Preview';
import AddTextSection from './Components/AddTextSection';
import AddVideoSection from './Components/AddVideoSection';
import ImageComponent from './Components/ImageComponent';
import {offerDataReducer, reducer} from './Reducer';
import EventBus from '../../Utils/Bus';
import {isEmpty} from 'lodash';
import PreviewButton from '../Dashboard/Components/Preview/PreviewButton';
import {previewButtonRequest} from '../../Services/PageRequests';
import SwitchOptions from './Components/SwitchOptions';
import PublishButton from './Components/PublishButton';
import Section from './Components/Section';
import DropdownComponent from './Components/DropdownComponent';
import InfoText from './Components/InfoText';

function App() {

    const [openIndex, setOpenIndex] = useState([0]);
    const [hoverSection, setHoverSection] = useState(null);
    const [courseData, dispatch] = useReducer(reducer, courseArray);
    const [sections, setSections] = useState(courseArray["sections"]);
    const [offerData, dispatchOfferData] = useReducer(offerDataReducer, offerArray);
    const [showPreviewButton, setShowPreviewButton] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [completedCrop, setCompletedCrop] = useState([])
    const nodesRef = useRef([]);
    const [fileNames, setFileNames] = useState([]);

    const divRef = useRef(null);

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

    const handleMouseHover = (e) => {
        setHoverSection(e.target.id)
    }

    const url = window.location.protocol + "//" + window.location.host + "/" + username + "/course-page/" + courseData["slug"];
    let videoCount = 0;
    let textCount = 0;

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
                />
            }

            {showPreviewButton &&
                <PreviewButton setShowPreview={setShowPreview}/>
            }

            <div className="left_column">
                <h3 className="mb-4 card_title">Create Your Course</h3>
                <div className="content_wrap my_row creator" id="left_col_wrap">
                    <section id="header_section"
                             className="my_row section_row"
                             onMouseEnter={(e) =>
                                 handleMouseHover(e)
                            }>
                        <div className="section_title">
                            <h4>Header</h4>
                        </div>
                        <div className="section_content my_row" ref={divRef}>
                            <InputComponent
                                placeholder="Course Title"
                                type="text"
                                maxChar={60}
                                hoverText="Submit Course Title"
                                elementName="title"
                                courseData={courseData}
                                dispatch={dispatch}
                                value={courseData["title"]}
                            />
                            <ImageComponent
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                fileNames={fileNames}
                                setFileNames={setFileNames}
                                setShowLoader={setShowLoader}
                                data={courseData}
                                dispatch={dispatch}
                                elementName="logo"
                                placeholder="Logo"
                                type="extPreview"
                                cropArray={{
                                    unit: "%",
                                    width: 60,
                                    height: 30,
                                    x: 25,
                                    y: 25,
                                }}
                            />
                            <div className="picker_wrap">
                                <ColorPicker
                                    label="Header Background Color"
                                    courseData={courseData}
                                    dispatch={dispatch}
                                    elementName="header_color"
                                />
                                <InfoText section="header_color" />
                            </div>
                            <div className="picker_wrap">
                                <ColorPicker
                                    label="Course Title Color"
                                    courseData={courseData}
                                    dispatch={dispatch}
                                    elementName="header_text_color"
                                />
                                <InfoText section="header_text_color"/>
                            </div>
                            <DropdownComponent
                                id={courseData["id"]}
                                dispatch={dispatch}
                                value={courseData["category"] || ""}
                            />
                            {courseData["slug"] && offerData["published"] ?
                                <div className="url_wrap">
                                    <p>Course URL:</p>
                                    <a target="_blank" href={url}>{url}</a>
                                </div>
                                :
                                ""
                            }
                        </div>
                    </section>
                    <section id="intro_video_section"
                             className="my_row section_row"
                             onMouseEnter={(e) =>
                                 setHoverSection(e.target.id)
                             }>
                        <div className="section_title">
                            <h4>Intro Video</h4>
                        </div>
                        <div className="section_content my_row">
                            <InputComponent
                                placeholder="YouTube or Vimeo Link"
                                type="url"
                                hoverText="Add Embed Link"
                                elementName="intro_video"
                                value={courseData["intro_video"] || ""}
                                courseData={courseData}
                                dispatch={dispatch}
                            />
                        </div>
                    </section>
                    <section id="intro_text_section"
                             className="my_row section_row"
                             onMouseEnter={(e) =>
                                 setHoverSection(e.target.id)
                             }>
                        <div className="section_title">
                            <h4>Intro Text</h4>
                        </div>
                        <div className="section_content my_row">
                            <InputComponent
                                placeholder="Intro Text"
                                type="wysiwyg"
                                hoverText="Submit Intro Text"
                                elementName="intro_text"
                                courseData={courseData}
                                dispatch={dispatch}
                                value={courseData["intro_text"]}
                            />
                            <ColorPicker
                                label="Background Color"
                                courseData={courseData}
                                dispatch={dispatch}
                                elementName="intro_background_color"
                            />
                        </div>
                    </section>

                    {!isEmpty(sections) &&

                        <section className="sections_wrap my_row">
                            {sections.map((section, index) => {

                                {section.type === "video" ? ++videoCount : ++textCount}

                                return (

                                    <Section
                                        key={section.id}
                                        section={section}
                                        index={index}
                                        sections={sections}
                                        setSections={setSections}
                                        openIndex={openIndex}
                                        setOpenIndex={setOpenIndex}
                                        videoCount={videoCount}
                                        textCount={textCount}
                                        setHoverSection={setHoverSection}
                                    />

                                )
                            })}
                        </section>
                    }

                    <div className="link_row mb-5">
                        <AddTextSection
                            sections={sections}
                            setSections={setSections}
                            courseID={courseData["id"]}
                            setOpenIndex={setOpenIndex}
                        />
                        <AddVideoSection
                            sections={sections}
                            setSections={setSections}
                            courseID={courseData["id"]}
                            setOpenIndex={setOpenIndex}
                        />
                    </div>

                    <section className="my_row section_row">
                        <div className="section_title">
                            <h4>Nitty Gritty</h4>
                        </div>
                        <div className="section_content my_row">
                            <ImageComponent
                                placeholder="Course Icon"
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                setCompletedCrop={setCompletedCrop}
                                fileNames={fileNames}
                                setFileNames={setFileNames}
                                setShowLoader={setShowLoader}
                                elementName={`icon`}
                                dispatch={dispatchOfferData}
                                data={offerData}
                                type={"inlinePreview"}
                                cropArray={{
                                    unit: '%',
                                    width: 30,
                                    aspect: 1
                                }}
                            />
                            <InputComponent
                                placeholder="$ Course price in USD"
                                type="currency"
                                hoverText="Submit Course Price"
                                elementName="price"
                                offerData={offerData}
                                dispatchOffer={dispatchOfferData}
                                value={offerData["price"]}
                            />
                            <SwitchOptions
                                dispatchOffer={dispatchOfferData}
                                offerData={offerData}
                            />
                        </div>
                    </section>

                    {!offerData["published"] &&

                        <PublishButton
                            offerData={offerData}
                            dispatchOffer={dispatchOfferData}
                            courseTitle={courseData["title"]}
                        />
                    }
                </div>
            </div>

            <div className={`right_column links_col preview${showPreview ? " show" : ""}`}>
                <Preview
                    sections={sections}
                    courseData={courseData}
                    setShowPreview={setShowPreview}
                    url={url}
                    hoverSection={hoverSection}
                    nodesRef={nodesRef}
                    completedCrop={completedCrop}
                    fileNames={fileNames}
                />
            </div>

        </div>
    )
}

export default App;
