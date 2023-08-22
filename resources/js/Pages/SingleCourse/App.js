import ColumnComponent from './Components/ColumnComponent';
import VideoComponent from './Components/VideoComponent';
import React, {useEffect, useState} from 'react';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';
import isJSON from 'validator/es/lib/isJSON';

const course = user.course;
const sections = user.sections;

function App() {

    const {intro_video, intro_text, intro_background_color, title} = course;
    const [indexValue, setIndexValue] = useState(null);

    const [introText, setIntroText] = useState(intro_text);

    useEffect(() => {

            if (introText && isJSON(introText)) {
                const allContent = JSON.parse(introText);
                allContent["blocks"] = allContent["blocks"].map((block) => {
                    if (!block.text) {
                        block.text = ""
                    }

                    return block;
                })

                setIntroText(draftToHtml(allContent));
            } else {
                setIntroText(introText)
            }

    },[])

    useEffect(() => {
        const handleScroll = (e) => {
            const divClass = document.querySelector('.member.course_page');

            if(divClass) {
                if (window.innerWidth < 768) {
                    const scrollPosition = window.scrollY;
                    const divTop = document.getElementById('course_title').offsetTop;
                    const header = document.querySelector('header');
                    const mainDiv = document.querySelector('main');

                    if (scrollPosition > divTop - 22) {
                        const headerHeight = header.offsetHeight;
                        const topPosition = headerHeight - 68;
                        header.style.position = 'fixed';
                        header.style.left = 0;
                        header.style.top = "-" + topPosition + "px";
                        mainDiv.style.paddingTop = headerHeight + 40 + "px";
                    } else {
                        header.style.top = "auto";
                        header.style.position = 'relative';
                        mainDiv.style.paddingTop = 40 + "px";
                    }

                }
            }
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.addEventListener('scroll', handleScroll)
        }

    }, []);

    const createMarkup = (text) => {

        return {
            __html: DOMPurify.sanitize(text)
        }
    }

    return (
        <div className="single_course_content my_row">
            <div className="container">
                <div className="my_row courses_grid">
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
                                <div dangerouslySetInnerHTML={createMarkup(introText)}>
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
