import React from 'react';

const TopBar = ({
                    courseData,
                    completedCrop,
                    fileNames,
                    nodesRef
}) => {

    const checkFound = () => {
        const isFound = fileNames?.find(el => {
            return el?.name === "logo";
        })
        return isFound || false;
    }

    console.log("nodes ref top bar comp: ", nodesRef);
    console.log("completedCrop: ", completedCrop);

    return (
        <div className="top_section" style={{
            background: courseData['header_color']
        }}>
            <div className="logo">
                {checkFound() ?
                    <canvas
                        ref={nodesRef}
                        style={{
                            width: completedCrop ? `100%` : 0,
                            height: completedCrop ? `100%` : 0,
                            backgroundSize: `cover`,
                            backgroundRepeat: `no-repeat`,
                        }}
                    />
                    :
                    <img src={courseData["logo"] || Vapor.asset("images/logo.png") } alt=""/>
                }
            </div>
            {courseData['title'] &&
                <h2 id="preview_title_section" className="title" style={{
                    color: courseData['header_text_color']
                }}>{courseData['title']}</h2>
            }
        </div>

    );
};

export default TopBar;
