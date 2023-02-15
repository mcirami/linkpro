import ColumnComponent from './Components/ColumnComponent';
import VideoComponent from './Components/VideoComponent';
import React, {useEffect, useState} from 'react';

const course = user.course;
const sections = user.sections;

function App() {

    const {intro_text, intro_background_color, intro_text_color, title} = course;
    const [row, setRow] = useState(null);
    const [indexValue, setIndexValue] = useState(null);
    const [videoCount, setVideoCount] = useState(0);

    useEffect(() => {
        const videos = (sections.filter((section) => section.type === "video"));
        setVideoCount(videos.length);
    },[])

    return (
        <div className="creator_wrap my_row courses_grid">
            <div className="preview">
                <section className="header">
                    <div className="intro_text my_row" style={{background: intro_background_color}}>
                        <div className="container">
                            <h2 style={{ color: intro_text_color }}>{title}</h2>
                            <p style={{ color: intro_text_color }}>{intro_text}</p>
                        </div>
                    </div>
                </section>
                <section>
                    <div className="container">
                        <div className="sections">
                            {sections.map((section, index) => {


                                const dataRow = Math.ceil((index + 1) / 3);

                                return(
                                    <React.Fragment key={section.id}>
                                        <ColumnComponent
                                            section={section}
                                            dataRow={dataRow}
                                            setRow={setRow}
                                            indexValue={indexValue}
                                            setIndexValue={setIndexValue}
                                            index={index}
                                        />

                                        {(index + 1) % 3 === 0 || index + 1 === videoCount ?
                                                <VideoComponent
                                                    sections={sections}
                                                    indexValue={indexValue}
                                                    dataRow={dataRow}
                                                    row={row}
                                                />
                                                :
                                            ""
                                        }
                                    </React.Fragment>
                                )
                            })}

                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default App;
