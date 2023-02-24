import ColumnComponent from './Components/ColumnComponent';
import VideoComponent from './Components/VideoComponent';
import React, {useEffect, useRef, useState} from 'react';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';

const course = user.course;
const sections = user.sections;

function App() {

    const {intro_text, intro_background_color, intro_text_color, title} = course;
    const [row, setRow] = useState(null);
    const [indexValue, setIndexValue] = useState(null);
    const [videoCount, setVideoCount] = useState(0);
    let dataRow = 0;

    let currentVideoCount = 0;
    let textCount = 0;
    let column = 0;

    useEffect(() => {
        const videos = (sections.filter((section) => section.type === "video"));
        setVideoCount(videos.length);
    },[])

    const createMarkup = (text) => {

        const html = draftToHtml(JSON.parse(text));
        return {
            __html: DOMPurify.sanitize(html)
        }
    }

    const resetVideoCount = (amount) => {
        currentVideoCount = amount;
        return "";
    }

    const resetTextCount = () => {
        textCount = 0;
        return "";
    }

    const addToDataRow = (index) => {
        dataRow = Math.ceil((index + 1) / 3);
        return "";
    }

    const resetColumn = () => {
        column = 0;
        return "";
    }

    return (
        <div className="container">
            <div className="creator_wrap my_row courses_grid">
                <section className="header">
                    <h2 className="title" style={{ color: intro_text_color }}>{title}</h2>
                    {indexValue &&
                        <VideoComponent
                            /*section={section}*/
                            indexValue={indexValue}
                            sections={sections}
                            /* dataRow={dataRow}
                             row={row}
                             index={index}*/
                        />
                    }
                    <div className="intro_text my_row" style={{background: intro_background_color}}>
                        <div dangerouslySetInnerHTML={createMarkup(intro_text)}>
                        </div>
                    </div>
                </section>
                <section className="my_row">
                    <div className="sections">
                        {sections.map((section, index) => {

                            /*let dataRow = Math.ceil((index + 1) / 3);

                            { (section.type === "video" && column === 3) && resetColumn()}
                            { (section.type === "video" && column !== 3) && ++column}
                            { section.type === "text" && resetColumn()}*/
                            return(
                                <React.Fragment key={section.id}>

                                    {/*{(section[index - 1] === undefined ||
                                    section[index - 1].type === "text") &&
                                    section.type === "video" &&
                                    <div className="grid_section">}*/}

                                    {/*{ (section[index + 1] === undefined ||
                                        section[index + 1].type === "text") &&
                                    section.type === "video" && </div>}*/}

                                     <ColumnComponent
                                        section={section}
                                        sections={sections}
                                        indexValue={indexValue}
                                        setIndexValue={setIndexValue}
                                        index={index}
                                        column={column}
                                    />

                                    {/*{
                                        currentVideoCount === 3 ||
                                        (sections[index + 1]?.type === "text" && section.type !== "text") ||
                                        !sections[index + 1]
                                            ?
                                            <>
                                                <VideoComponent
                                                    sections={sections}
                                                    indexValue={indexValue}
                                                    dataRow={dataRow}
                                                    row={row}
                                                    iframeRef={iframeRef}
                                                />
                                                {resetVideoCount()}
                                            </>
                                            :
                                        ""
                                    }*/}
                                </React.Fragment>
                            )
                        })}
                    </div>
                </section>
            </div>
        </div>
    )
}

export default App;
