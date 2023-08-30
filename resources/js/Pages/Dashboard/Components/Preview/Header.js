import React, {useContext} from 'react';
import {PageContext} from '../../App';

const Header = ({
                    nodesRef,
                    completedCrop,
                    fileName,
                }) => {

    const {pageSettings} = useContext(PageContext);
    const myStyle = {
        background: "url(" + pageSettings["header_img"] + ") no-repeat",
        backgroundSize: "cover",
    };

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
                        ref={ref => nodesRef.current["header_img"] = ref}
                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                        style={{
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
