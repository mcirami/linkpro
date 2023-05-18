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
                     completedCrop,
                     nodesRef,
                     fileNames,
                     setFileNames,
                     pageData,
                     sections,
                     setShowPreview,
                     hoverSection
}) => {

    useEffect(() => {

        if (hoverSection) {

            const target = document.getElementById('preview_' + hoverSection);
            if(target) {
                if (hoverSection.includes("header")) {
                    console.log("if: ", target)
                    target.parentNode.scrollTop = target.offsetTop;
                } else {
                    console.log("else: ", target)
                    target.parentNode.parentNode.scrollTop = target.offsetTop +
                        100;
                }
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
                <div className="inner_content" id="preview_wrap" >
                    <div className="inner_content_wrap" >
                        <section className={`header ${hoverSection === 'header_section' ? "active" : ""}`} id="preview_header_section">
                            <TopBar
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                fileNames={fileNames}
                                pageData={pageData}
                            />
                            <Hero
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                fileNames={fileNames}
                                pageData={pageData}
                                elementName="hero"
                            />

                        </section>
                        <div className="sections">
                            {!isEmpty(sections) && sections.map((section, index) => {

                                return (
                                    <PreviewSection
                                        key={section.id}
                                        currentSection={section}
                                        nodesRef={nodesRef}
                                        completedCrop={completedCrop}
                                        fileNames={fileNames}
                                        position={index + 1}
                                        hoverSection={hoverSection}
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
