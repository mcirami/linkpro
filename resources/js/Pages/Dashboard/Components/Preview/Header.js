import React, {useContext} from 'react';
import {PageContext} from '../../App';

const Header = ({
                    imageRefs,
                    completedCrop,
                    fileName,
                }) => {

    const {pageSettings} = useContext(PageContext);
    const myStyle = {
        background: "url(" + pageSettings["header_img"] + ") no-repeat",
        backgroundSize: "cover",
    };

    console.log("setRef: ", imageRefs);
    return (

        <>
            {!pageSettings["header_img"] && !fileName ?
            <div className="page_header default">
                <img src={ Vapor.asset("images/default-img.png") } alt=""/>
            </div>
            :
            ""
            }

            {pageSettings["header_img"] && !fileName ?
                <div className="page_header" style={myStyle}>
                </div>
                :
                <div className="page_header canvas"
                     style={{
                         width: completedCrop["header_img"]?.isCompleted ? `100%` : 0,
                         height: completedCrop["header_img"]?.isCompleted ? `auto` : 0,
                     }}>
                    <canvas
                        ref={ref => imageRefs.current["header_img"] = ref}
                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                        style={{
                            /*backgroundImage: setRef,*/
                            /*width: Math.round(completedCrop?.width ?? 0),
                            height: Math.round(completedCrop?.height ?? 0)*/
                            width: completedCrop["header_img"]?.isCompleted ? `100%` : 0,
                            height: completedCrop["header_img"]?.isCompleted ? `auto` : 0,
                            borderTopRightRadius: `12%`,
                            borderTopLeftRadius: `12%`,
                        }}
                    />
                </div>
            }
        </>
    )
}

export default Header;
