import React, {useState, useRef, useReducer, useEffect} from 'react';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';

const page = user.livePage;
const sections = user.liveSections;


function App() {

    const createMarkup = (text) => {

        const html = draftToHtml(JSON.parse(text));
        return {
            __html: DOMPurify.sanitize(html)
        }
    }

    /*useEffect(() => {

        const textSections = document.querySelectorAll('.sections .text');
        console.log(textSections)
        textSections.forEach((section) => {
           if(section.querySelector('p span').style.fontSize) {
               const size = section.querySelector('p span').style.fontSize

               section.querySelector('p span').style.fontSize = size + .20;
           }
        })

    },[])*/

    return (

        <div>
            <section className="header">
                <div className="top_section" style={{ background: page.header_color }}>
                    <div className="container">
                        <div className="logo">
                            <img src={ page.logo } alt="" />
                        </div>
                        <div className="text_wrap">
                            <p style={{ color: page.header_text_color }}>{page.slogan}</p>
                        </div>
                    </div>
                </div>
                <div className="header_image my_row"
                 style={{
                     background: "url(" + page.hero  + ") no-repeat",
                     backgroundPosition: "center",
                     backgroundSize: "cover"
                 }}
            >
                <a className="button"
                   style={{
                       background: page.button_color,
                       color: page.button_text_color
                }}
                   href={page.button_link}
                >
                    {page.button_text}
                </a>
            </div>
        </section>
            <div className="sections">
                {sections?.map((section => {
                    return (
                        <section>
                            {section.type === "text" &&
                                <div className="text" style={{ background: section.bg_color }}>
                                    <div className="container">
                                        { (section.button && section.button_position === "above") ?
                                            <div className={`button_wrap ${section.button_position}`}>
                                                <a className={`button ${section.button_position}`}
                                                   style={{
                                                          background: page.button_color,
                                                          color: page.button_text_color
                                                          }}
                                                   href={section.button_link}
                                                >
                                                    {page.button_text}
                                                </a>
                                            </div>
                                            :
                                            ""
                                        }
                                        <div dangerouslySetInnerHTML={createMarkup(section.text)}>
                                        </div>
                                        { (section.button && section.button_position === "below") ?
                                            <div className={`button_wrap ${section.button_position}`}>
                                                <a className={`button ${section.button_position}`}
                                                   style={{
                                                       background: page.button_color,
                                                       color: page.button_text_color
                                                   }}
                                                   href={section.button_link}
                                                >
                                                    {page.button_text}
                                                </a>
                                            </div>
                                            :
                                            ""
                                        }
                                    </div>
                                </div>
                            }
                            {section.type === "image" &&
                                <div className="image"
                                     style={{
                                         background: "url(" + section.image + ") no-repeat",
                                         backgroundPosition: "center",
                                         backgroundSize: "cover"
                                     }}>
                                    {section.button ?
                                        <div className={`button_wrap ${section.button_position}`}>
                                            <a className="button"
                                               style={{
                                                   background: page.button_color,
                                                   color: page.button_text_color
                                               }}
                                               href={section.button_link}
                                            >
                                                { page.button_text}
                                            </a>
                                        </div>
                                        :
                                        ""
                                    }
                                </div>
                            }
                        </section>
                    )
                }))}

            </div>
        </div>

    )
}

export default App;
