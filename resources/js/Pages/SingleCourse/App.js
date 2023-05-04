import ColumnComponent from './Components/ColumnComponent';
import VideoComponent from './Components/VideoComponent';
import React, {useEffect, useRef, useState} from 'react';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';
import PurchaseCoursePopup from '../../Utils/PurchaseCoursePopup';

const course = user.course;
const sections = user.sections;

function App() {

    const {intro_video, intro_text, intro_background_color, title} = course;
    const [indexValue, setIndexValue] = useState(null);
    const [purchasePopup, setPurchasePopup] = useState({
        show: false,
        button_color: "",
        button_text_color: "",
        button_text: "",
        button_link: ""
    });

    const createMarkup = (text) => {

        const html = draftToHtml(JSON.parse(text));
        return {
            __html: DOMPurify.sanitize(html)
        }
    }

    return (
        <div className="single_course_content my_row">
            {purchasePopup.show &&
                <PurchaseCoursePopup
                    purchasePopup={purchasePopup}
                    setPurchasePopup={setPurchasePopup}
                />
            }
            <div className="container">
                <div className="creator_wrap my_row courses_grid">
                    <h2 className="title" style={{color: '#000000'}}>{title}</h2>
                    {indexValue &&
                        <VideoComponent
                            indexValue={indexValue}
                            sections={sections}
                        />
                    }
                    <section className="header">
                        { (intro_video && !indexValue) &&
                            <div className="intro_video">
                                <div className="video_wrapper">
                                    <iframe src={intro_video} allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture;" allowFullScreen></iframe>
                                </div>
                            </div>
                        }
                        {intro_text &&
                            <div className="intro_text my_row" style={{background: intro_background_color}}>
                                <div dangerouslySetInnerHTML={createMarkup(
                                    intro_text)}>
                                </div>
                            </div>
                        }
                    </section>
                    <section className="my_row">
                        <div className="sections">
                            {sections.map((section, index) => {
                                return(
                                    <React.Fragment key={section.id}>
                                         <ColumnComponent
                                            section={section}
                                            indexValue={indexValue}
                                            setIndexValue={setIndexValue}
                                            index={index}
                                            course={course}
                                            setPurchasePopup={setPurchasePopup}
                                        />
                                    </React.Fragment>
                                )
                            })}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default App;
