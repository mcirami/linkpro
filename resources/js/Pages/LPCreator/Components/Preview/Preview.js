import React, {useEffect, useState} from 'react';
import TopBar from './TopBar';
import PreviewSection from './PreviewSection';
import Hero from './Hero';

const Preview = ({
                     completedCrop,
                     nodesRef,
                     fileNames,
                     setFileNames,
                     colors,
                     sections,
                     textArray,
                     isFound,
                     setIsFound
}) => {

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
                                isFound={isFound}
                                setIsFound={setIsFound}
                            />
                            <Hero
                                nodesRef={nodesRef}
                                completedCrop={completedCrop}
                                fileNames={fileNames}
                                colors={colors}
                                textArray={textArray}
                                isFound={isFound}
                                setIsFound={setIsFound}
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
                                    isFound={isFound}
                                    setIsFound={setIsFound}
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
