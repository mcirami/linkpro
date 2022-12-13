import React, {useEffect, useState} from 'react';
import TopBar from './TopBar';
import PreviewSection from './PreviewSection';
import Hero from './Hero';

const Preview = ({
                     completedCrop,
                     nodesRef,
                     nodes,
                     fileNames,
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
                                nodes={nodes}
                                completedCrop={completedCrop}
                                fileNames={fileNames}
                                colors={colors}
                                textArray={textArray}
                                isFound={isFound}
                                setIsFound={setIsFound}
                            />
                            <Hero
                                nodesRef={nodesRef}
                                nodes={nodes}
                                completedCrop={completedCrop}
                                fileNames={fileNames}
                                colors={colors}
                                textArray={textArray}
                                isFound={isFound}
                                setIsFound={setIsFound}
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
                                    nodes={nodes}
                                    completedCrop={completedCrop}
                                    fileNames={fileNames}
                                    isFound={isFound}
                                    setIsFound={setIsFound}
                                    elementName={"section"+data.position+"image"}
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
