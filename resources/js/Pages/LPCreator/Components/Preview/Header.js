import React, {useEffect, useState} from 'react';

const Header = ({
                    nodesRef,
                    completedCrop,
                    fileNames,
                    colors,
                    textArray
}) => {

    const [headerImageStyle, setHeaderImageStyle] = useState(null);
    const [buttonStyle, setButtonStyle] = useState(null);

    useEffect(() => {
        setHeaderImageStyle (
            !fileNames?.header ?
                {
                    background: "url(" +
                        Vapor.asset("images/top-section-image.jpg") +
                        ") center center no-repeat",
                    backgroundSize: "cover",
                    minHeight: "200px"
                }
                :
                {
                    width: (completedCrop.header?.isCompleted) ? `100%` : 0,
                    height: (completedCrop.header?.isCompleted) ? `auto` : 0,
                }
        )
    },[completedCrop.header])

    useEffect(() => {
        setButtonStyle ({
            background: colors.buttonBg || '#000000',
            color: colors.buttonText || '#ffffff'
        })

    },[colors.buttonBg, colors.buttonText])

    return (
        <section className="header">
            <div className="top_section" style={{
                background: colors.headerBg || '#ffffff'
            }}>
                <div className="container">
                    <article className="logo">
                        {!fileNames?.logo ?
                                <img src={ Vapor.asset("images/logo.png") } alt=""/>
                            :
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
                    }
                    </article>
                    <article className="text_wrap">
                        <p>{textArray.slogan}</p>
                    </article>
                </div>
            </div>
            <article className="header_image my_row"
                style={headerImageStyle}>
                {fileNames?.header &&
                    <canvas
                        className="bg_image"
                        ref={ref => nodesRef.current["header"] = ref}
                        // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                        style={{
                            backgroundImage: nodesRef.current["header"],
                            /*width: Math.round(completedCrop?.width ?? 0),
                            height: Math.round(completedCrop?.height ?? 0)*/
                            backgroundSize: `cover`,
                            backgroundRepeat: `no-repeat`,
                            width: completedCrop.header?.isCompleted ? `100%` : 0,
                            height: completedCrop.header?.isCompleted ? `auto` : 0,
                        }}
                    />
                }
                <a className="button" href="#" style={buttonStyle}>
                    {textArray.buttonText || "Get Course"}
                </a>
            </article>

        </section>
    );
};

export default Header;
