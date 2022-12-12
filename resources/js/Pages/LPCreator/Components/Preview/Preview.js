import React, {useEffect, useState} from 'react';
import Header from './Header';
import Section from './Section';

const Preview = ({
                     completedCrop,
                     nodesRef,
                     nodes,
                     fileNames,
                     colors,
                     sectionData,
                     textArray
}) => {


    return (

        <>
            {/*<div className="close_preview" onClick={ClosePreview}>
                <IoIosCloseCircleOutline/>
            </div>*/}

            <div className="links_wrap preview">
                <div className="inner_content" id="preview_wrap">
                    <div className="inner_content_wrap">
                        <Header
                            nodesRef={nodesRef}
                            nodes={nodes}
                            completedCrop={completedCrop}
                            fileName={fileNames}
                            colors={colors}
                            textArray={textArray}
                        />
                        {sectionData.map((data, index) => {
                            return (
                                <Section
                                    key={index}
                                    colors={colors}
                                    data={data}
                                    textArray={textArray}
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
