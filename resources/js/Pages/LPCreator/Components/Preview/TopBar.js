import React, {useEffect, useState} from 'react';

const TopBar = ({
                    nodesRef,
                    completedCrop,
                    pageData
}) => {

    return (
        <div className="top_section" style={{
            background: pageData["header_color"]
        }}>
            <div className="logo">
                {completedCrop["logo"]?.isCompleted ?
                    <canvas
                        ref={ref => nodesRef.current["logo"] = ref }
                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                        style={{
                            /*backgroundImage: nodesRef.current["logo"],*/
                            /*width: Math.round(completedCrop?.width ?? 0),
                            height: Math.round(completedCrop?.height ?? 0)*/
                            width: completedCrop["logo"]?.isCompleted ? `100%` : 0,
                            height: completedCrop["logo"]?.isCompleted ? `100%` : 0,
                            backgroundSize: `cover`,
                            backgroundRepeat: `no-repeat`,
                        }}
                    />
                    :
                    <img src={pageData["logo"] || Vapor.asset("images/logo.png") } alt=""/>
                }
            </div>
            <div className="text_wrap">
                <p style={{color: pageData["header_text_color"]}}>{pageData["slogan"]}</p>
            </div>
        </div>

    );
};

export default TopBar;
