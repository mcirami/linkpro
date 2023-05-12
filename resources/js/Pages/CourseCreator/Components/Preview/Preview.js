import React, {useEffect, useState, useLayoutEffect, createRef} from 'react';
import TopBar from './TopBar';
import PreviewSection from './PreviewSection';
import Hero from './Hero';
import {
    PreviewHeight,
} from '../../../../Services/PreviewHooks';
import {isEmpty} from 'lodash';
import {IoIosCloseCircleOutline} from 'react-icons/io';

const Preview = ({
                     courseData,
                     sections,
                     setShowPreview,
                     url,
                     hoverSection
}) => {



    useEffect(() => {

        if (hoverSection) {
            const target = document.getElementById('preview_' + hoverSection);
            if (hoverSection.includes("title")) {
                target.parentNode.scrollTop = target.offsetTop;
            } else if (hoverSection.includes("intro")) {
                target.parentNode.parentNode.parentNode.scrollTop = target.offsetTop - 100;
            } else {
                target.parentNode.parentNode.scrollTop = target.offsetTop + 450;
            }
        }

    },[hoverSection])

    useLayoutEffect(() => {

        PreviewHeight()

        window.addEventListener('resize', PreviewHeight);

        return () => {
            window.removeEventListener('resize', PreviewHeight);
        }
    }, []);

    const ClosePreview = () => {
        document.querySelector('body').classList.remove('fixed');
        setShowPreview(false);
    }

    return (

        <>
            <div className="close_preview" onClick={ClosePreview}>
                <IoIosCloseCircleOutline />
            </div>

            <div className="links_wrap preview">
                <div className="inner_content" id="preview_wrap">
                    <div className="inner_content_wrap" >
                        <section className="header" id="preview_title_section">
                            <TopBar />
                            {courseData['title'] &&
                                <h2 className="title">{courseData['title']}</h2>
                            }
                            <Hero
                                courseData={courseData}
                            />
                        </section>
                        <div className="sections">
                            {!isEmpty(sections) && sections.map((section, index) => {

                                return (
                                    <PreviewSection
                                        key={section.id}
                                        currentSection={section}
                                        index={index}
                                        url={url}
                                    />
                                )
                            })}
                        </div>

                    </div>
                </div>
            </div>
        </>
    );
};

export default Preview;
