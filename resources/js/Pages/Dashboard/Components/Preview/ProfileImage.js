import React, {useContext} from 'react';
import {PageContext} from '../../App';

const ProfileImage = ({
                          profileFileName,
                          completedCrop,
                          imageRefs,
                      }) => {

    const {pageSettings} = useContext(PageContext);

    return (

        <>
            <div className={`
            ${(pageSettings["profile_img"] && !profileFileName) || profileFileName
                ? "profile_img_column"
                :
                "profile_img_column default"} `}
            >
                {!profileFileName ?
                    <div className="profile_image">
                        <div className="image_wrap">
                            <img src={pageSettings["profile_img"] ||
                            Vapor.asset("images/default-img.png") } alt=""/>
                        </div>
                    </div>
                    :
                    <div className={"profile_image"}>
                        <div className="image_wrap">
                            <canvas
                                ref={ref => imageRefs.current["profile_img"] = ref}
                                // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                style={{
                                    /*backgroundImage: profileRef,*/
                                    backgroundSize: `cover`,
                                    backgroundRepeat: `no-repeat`,
                                    /*width: Math.round(completedCrop?.width ?? 0),
                                    height: Math.round(completedCrop?.height ?? 0)*/
                                    width: completedCrop["profile_img"]?.isCompleted ?
                                        `100%` :
                                        0,
                                    height: completedCrop["profile_img"]?.isCompleted ?
                                        `100%` :
                                        0,
                                    borderRadius: `50px`,
                                }}
                            />
                        </div>
                    </div>
                }

            </div>
        </>
    )
}

export default ProfileImage;
