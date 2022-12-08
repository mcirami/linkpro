import React, {useEffect, useState} from 'react';
import Header from './Header';

const Preview = ({
                     completedCrop,
                     setCompletedCrop,
                     nodesRef,
                     nodes,
                     fileNameLogo,
                     fileNameHeader,
                     colors
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
                            fileName={fileNameLogo}
                            fileNameHeader={fileNameHeader}
                            colors={colors}
                        />

                    </div>
                </div>
            </div>
        </>
    );
};

export default Preview;
