import React, {useEffect, useState} from 'react';

const TopBar = ({
                    nodesRef,
                    completedCrop,
                    fileNames,
                    colors,
                    textArray,
                    pageData
}) => {

    const checkFound = () => {
        const isFound = fileNames?.find(el => {
            return el?.name === "logo";
        })
        return isFound || false;
    }

    return (
        <div className="top_section" style={{
            background: pageData["header_color"] || '#ffffff'
        }}>
            <div className="container">
                <article className="logo">
                    {checkFound() ?
                        <canvas
                            ref={ref => nodesRef.current["logo"] = ref }
                            // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                            style={{
                                backgroundImage: nodesRef.current["logo"],
                                /*width: Math.round(completedCrop?.width ?? 0),
                                height: Math.round(completedCrop?.height ?? 0)*/
                                width: completedCrop.logo?.isCompleted ? `100%` : 0,
                                height: completedCrop.logo?.isCompleted ? `100%` : 0,
                                backgroundSize: `cover`,
                                backgroundRepeat: `no-repeat`,
                            }}
                        />
                        :
                        <img src={pageData["logo"] || Vapor.asset("images/logo.png") } alt=""/>
                    }
                </article>
                <article className="text_wrap">
                    <p>{pageData["slogan"]}</p>
                </article>
            </div>
        </div>

    );
};

export default TopBar;
