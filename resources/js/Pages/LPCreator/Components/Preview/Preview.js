import React, {useEffect, useState, useLayoutEffect, createRef} from 'react';
import TopBar from './TopBar';
import PreviewSection from './PreviewSection';
import Hero from './Hero';
import {
    UseLoadPreviewHeight,
    UseResizePreviewHeight
} from '../../../../Services/PreviewHooks';
import {isEmpty} from 'lodash';
import {IoIosCloseCircleOutline} from 'react-icons/io';

const Preview = ({
                     completedCrop,
                     nodesRef,
                     fileNames,
                     pageData,
                     sections,
                     setShowPreview,
                     hoverSection,
                     url
}) => {

    const loadPreviewHeight = UseLoadPreviewHeight();
    const resizePreviewHeight = UseResizePreviewHeight();

    useEffect(() => {

        if (hoverSection) {

            const target = document.getElementById('preview_' + hoverSection);
            if(target) {
                if (hoverSection.includes("header")) {
                    target.parentNode.scrollTop = target.offsetTop;
                } else {
                    target.parentNode.parentNode.scrollTop = target.offsetTop + 100;
                }
            }
        }

    },[hoverSection])

    const ClosePreview = () => {
        document.querySelector('body').classList.remove('fixed');
        setShowPreview(false);
    }

    return (

        <>
            <div className="close_preview" onClick={ClosePreview}>
                <IoIosCloseCircleOutline />
            </div>

            <div className="links_wrap preview lp_creator">
                <div className="inner_content" id="preview_wrap" >
                    <div className="inner_content_wrap" style={{ maxHeight: resizePreviewHeight ? resizePreviewHeight + "px" : loadPreviewHeight + "px"}}>
                        <section className={`my_row header ${hoverSection === 'header_section' ? "active" : ""}`} id="preview_header_section">
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
