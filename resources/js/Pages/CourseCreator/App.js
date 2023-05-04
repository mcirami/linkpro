import React, {useState, useRef, useReducer, useEffect} from 'react';

const courseArray = user.course;
const offerArray = user.offerData;
const username = user.username;
import {Loader} from '../../Utils/Loader';
import {Flash} from '../../Utils/Flash';
import InputComponent from './Components/InputComponent';
import ColorPicker from './Components/ColorPicker';
import Preview from './Components/Preview/Preview';
import VideoComponent from './Components/VideoComponent';
import AddTextSection from './Components/AddTextSection';
import AddVideoSection from './Components/AddVideoSection';
import ImageComponent from './Components/ImageComponent';
import SectionButtonOptions from './Components/SectionButtonOptions';
import {offerDataReducer, reducer} from './Reducer';
import EventBus from '../../Utils/Bus';
import {isEmpty} from 'lodash';
import DeleteSection from './Components/DeleteSection';
import PreviewButton from '../Dashboard/Components/Preview/PreviewButton';
import {previewButtonRequest} from '../../Services/PageRequests';
import SwitchOptions from './Components/SwitchOptions';
import PublishButton from './Components/PublishButton';

function App() {

    //const [completedLogoCrop, setCompletedLogoCrop] = useState(null);
    //const [fileNameLogo, setFileNameLogo] = useState(null);
    //const [completedHeaderCrop, setCompletedHeaderCrop] = useState(null);
    //const [fileNameHeader, setFileNameHeader] = useState(null);

    const [courseData, dispatch] = useReducer(reducer, courseArray);
    const [sections, setSections] = useState(courseArray["sections"]);
    const [offerData, dispatchOfferData] = useReducer(offerDataReducer, offerArray);
    //const [stateOfferData, setStateOfferData] = useState(offerArray);
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

    const url = window.location.protocol + "//" + window.location.host + "/" + username + "/course/" + courseData["slug"];
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
                    <section className="my_row section">
                        <div className="section_title">
                            <h4>Title</h4>
                        </div>
                        <div className="section_content my_row">
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
                            {courseData["slug"] &&
                                <div className="url_wrap">
                                    <p>Course URL:</p>
                                    <a target="_blank" href={url}>{url}</a>
                                </div>
                            }
                        </div>
                    </section>
                    <section className="my_row">
                        <div className="section_title">
                            <h4>Buttons</h4>
                        </div>
                        <div className="section_content my_row">
                            <ColorPicker
                                label="Button Color"
                                courseData={courseData}
                                dispatch={dispatch}
                                elementName="button_color"
                            />
                            <ColorPicker
                                label="Button Text Color"
                                courseData={courseData}
                                dispatch={dispatch}
                                elementName="button_text_color"
                            />
                            <InputComponent
                                placeholder="Update Button Text (optional)"
                                type="text"
                                maxChar={10}
                                hoverText="Submit Button Text"
                                elementName="button_text"
                                courseData={courseData}
                                value={courseData["button_text"]}
                                dispatch={dispatch}
                            />
                        </div>
                    </section>
                    <section className="my_row section">
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
                    <section className="my_row section">
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

                    {!isEmpty(sections) && sections.map((section, index) => {

                        const {id, type, text, video_title, video_link, button_position, button} = section;

                        {type === "video" ? ++videoCount : ++textCount}
                        return (
                            <section className="my_row" key={id}>
                                <div className="section_title">
                                    <h4>{type} {type === "video" ? videoCount : textCount}</h4>
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
                                                hoverText="Add Text to Section"
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
                                                elementName={`section_${index + 1}_background_color`}
                                            />
                                            <ColorPicker
                                                label="Text Color"
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                                elementName={`section_${index + 1}_text_color`}
                                            />
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
                                        </>
                                        :
                                        <>
                                            <InputComponent
                                                placeholder="Video Title"
                                                type="text"
                                                maxChar={65}
                                                hoverText="Add Video Title"
                                                elementName={`video_${index + 1}_title`}
                                                value={video_title || ""}
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                            />
                                            <InputComponent
                                                placeholder="YouTube or Vimeo Link"
                                                type="url"
                                                hoverText="Add Embed Link"
                                                elementName={`video_${index + 1}_link`}
                                                value={video_link || ""}
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                            />
                                            <InputComponent
                                                placeholder="Video Text Blurb (optional)"
                                                type="textarea"
                                                hoverText={`Submit Text Blurb`}
                                                elementName={`section_${index + 1}_text`}
                                                value={text || ""}
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                            />
                                            <ColorPicker
                                                label="Background Color"
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                                elementName={`section_${index + 1}_background_color`}
                                            />
                                            <ColorPicker
                                                label="Text Color"
                                                currentSection={section}
                                                sections={sections}
                                                setSections={setSections}
                                                elementName={`section_${index + 1}_text_color`}
                                            />
                                        </>
                                    }
                                </div>
                            </section>
                        )
                    })}

                    <div className="link_row mb-5">
                        <AddTextSection
                            sections={sections}
                            setSections={setSections}
                            courseID={courseData["id"]}
                        />
                        <AddVideoSection
                            sections={sections}
                            setSections={setSections}
                            courseID={courseData["id"]}
                        />
                    </div>

                    <section className="my_row">
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
                                offerData={offerData}
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
                />
            </div>

        </div>
    )
}

export default App;
