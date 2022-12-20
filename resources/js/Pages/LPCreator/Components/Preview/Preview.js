import React, {useEffect, useState, useLayoutEffect} from 'react';
import TopBar from './TopBar';
import PreviewSection from './PreviewSection';
import Hero from './Hero';
import {
    PreviewHeight,
} from '../../../../Services/PreviewHooks';

const Preview = ({
                     completedCrop,
                     nodesRef,
                     fileNames,
                     setFileNames,
                     colors,
                     sections,
                     textArray,
                     pageData,
}) => {

    useLayoutEffect(() => {

        window.addEventListener('resize', PreviewHeight);

        return () => {
            window.removeEventListener('resize', PreviewHeight);
        }
    }, []);

    useLayoutEffect(() => {
        PreviewHeight();
    }, []);

    return (

        <>
            {/*<div className="close_preview" onClick={ClosePreview}>
                <IoIosCloseCircleOutline/>
            </div>*/}

            <div className="links_wrap preview">
                <div className="inner_content" id="preview_wrap">
                    <div className="inner_content_wrap">
                        <section className="header">
                            <TopBar
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                fileNames={fileNames}
                                colors={colors}
                                textArray={textArray}
                                pageData={pageData}
                            />
                            <Hero
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                fileNames={fileNames}
                                colors={colors}
                                textArray={textArray}
                                pageData={pageData}
                                elementName="hero"
                            />

                        </section>
                        {sections.map((data, index) => {

                            return (
                                <PreviewSection
                                    key={index}
                                    colors={colors}
                                    data={data}
                                    textArray={textArray}
                                    nodesRef={nodesRef}
                                    completedCrop={completedCrop}
                                    fileNames={fileNames}
                                    setFileNames={setFileNames}
                                    position={index + 1}
                                />
                            )
                        })}

                    </div>
                </div>
            </div>
        </>
    );
};

export default Preview;
