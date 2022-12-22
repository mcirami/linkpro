import React, {useEffect, useState, useLayoutEffect} from 'react';
import TopBar from './TopBar';
import PreviewSection from './PreviewSection';
import Hero from './Hero';
import {
    PreviewHeight,
} from '../../../../Services/PreviewHooks';
import {isEmpty} from 'lodash';

const Preview = ({
                     completedCrop,
                     nodesRef,
                     fileNames,
                     setFileNames,
                     pageData,
                     sections
}) => {

    useLayoutEffect(() => {
        console.log("use layout effect")
        PreviewHeight();
    }, []);

    useLayoutEffect(() => {

        window.addEventListener('resize', PreviewHeight);

        return () => {
            window.removeEventListener('resize', PreviewHeight);
        }
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
                        {!isEmpty(sections) && sections.map((data, index) => {

                            return (
                                <PreviewSection
                                    key={index}
                                    data={data}
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
        </>
    );
};

export default Preview;
