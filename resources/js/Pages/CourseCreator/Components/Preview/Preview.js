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
                     courseData,
                     sections,
                     setShowPreview,
                     url,
                     hoverSection,
                     nodesRef,
                     completedCrop,
                     fileNames
}) => {


    const loadPreviewHeight = UseLoadPreviewHeight();
    const resizePreviewHeight = UseResizePreviewHeight();

    useEffect(() => {

        if (hoverSection) {
            const target = document.getElementById('preview_' + hoverSection);
            if (target) {
                if (hoverSection.includes("header")) {
                    target.parentNode.scrollTop = target.offsetTop;
                } else if (hoverSection.includes("intro")) {
                    target.parentNode.parentNode.parentNode.scrollTop = target.offsetTop -
                        100;
                } else {
                    target.parentNode.parentNode.scrollTop = target.offsetTop +
                        450;
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

            <div className="links_wrap preview">
                <div className="inner_content" id="preview_wrap">
                    <div className="inner_content_wrap" style={{ maxHeight: resizePreviewHeight ? resizePreviewHeight + "px" : loadPreviewHeight + "px"}}>
                        <section className="header" id="preview_header_section">
                            <TopBar
                                courseData={courseData}
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                fileNames={fileNames}
                            />
                        </section>
                        <section>
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
