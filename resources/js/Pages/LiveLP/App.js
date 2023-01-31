import React, {useState, useRef, useReducer, useEffect} from 'react';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';
import SectionComponent from './SectionComponent';

const page = user.livePage;
const sections = user.liveSections;


function App() {

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
            </div>
        </section>
            <div className="sections">
                {sections?.map(( (section, index) => {

                    return (
                        <SectionComponent page={page} section={section} key={index}/>
                    )
                }))}

            </div>
        </div>

    )
}

export default App;
