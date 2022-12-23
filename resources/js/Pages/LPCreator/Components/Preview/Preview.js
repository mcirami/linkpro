import React, {useEffect, useState, useLayoutEffect, createRef} from 'react';
import TopBar from './TopBar';
import PreviewSection from './PreviewSection';
import Hero from './Hero';
/*import {
    PreviewHeight,
} from '../../../../Services/PreviewHooks';*/
import {isEmpty} from 'lodash';
import {IoIosCloseCircleOutline} from 'react-icons/io';

const Preview = ({
                     completedCrop,
                     nodesRef,
                     fileNames,
                     setFileNames,
                     pageData,
                     sections,
                     setShowPreview
}) => {


    const innerContentRef = createRef();
    const previewWrapRef = createRef();

    useLayoutEffect(() => {
        PreviewHeight()
        window.addEventListener('resize', PreviewHeight);

        return () => {
            window.removeEventListener('resize', PreviewHeight);
        }
    }, []);

    const PreviewHeight = () => {
        const windowWidth = window.outerWidth;

        const innerContent = document.getElementById('preview_wrap');
        const box = document.querySelector('.inner_content_wrap');

        console.log("window width: ", windowWidth);
        let pixelsToMinus;
        if (windowWidth > 551) {
            pixelsToMinus = 30;
        } else {
            pixelsToMinus = 20;
        }

        console.log("ref height: ", previewWrapRef.current.offsetHeight);

        box.style.maxHeight = innerContent.offsetHeight - pixelsToMinus + "px";
    }

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
                <div className="inner_content" id="preview_wrap" ref={previewWrapRef}>
                    <div className="inner_content_wrap" ref={innerContentRef}>
                        <section className="header">
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
                                        setFileNames={setFileNames}
                                        pageData={pageData}
                                        position={index + 1}
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
