const page_header_path = user.page_header_path;
const page_profile_path = user.page_profile_path;

const Preview = ({links, page, count, defaultIconPath}) => {

    const currentPageHeader = page_header_path + "/" + page["header_img"];
    const currentPageProfileIMG = page_profile_path + "/" + page["profile_img"];

    const myStyle = {
        background: "url(" + currentPageHeader + ") no-repeat",
        backgroundSize: "100%",
        padding: "20%"

    };

    return (

        <div className="preview_wrap">

            <div className="inner_content">
                <div className="page_header"
                    style={myStyle}
                >
                </div>
                <div className="profile_content">
                    <div className="profile_image">
                        <img src={currentPageProfileIMG} alt=""/>
                    </div>
                    <div className="profile_text">
                        <h2>{page["title"]}</h2>
                        <p>{page["bio"]}</p>
                    </div>
                </div>
                <div className="icons_wrap">
                    {links.map((linkItem) => {
                        const { id, url, icon, active_status } = linkItem;
                        return (
                            <div key={id || Math.random()}>
                                { active_status ?
                                    <div className="icon_col" key={id}>
                                        <a target="_blank" href={url}>
                                            <img src={icon} />
                                        </a>
                                    </div>
                                 : "" }
                             </div>
                        )
                    })}
                    {/*{count < 9 ?
                        <DefaultIcon count={count}
                                     defaultIconPath={defaultIconPath}
                                    />
                        : ""
                    }*/}
                </div>
            </div>
        </div>
    );
}

/*
const DefaultIcon = ({count, defaultIconPath}) => {

    let n = 9 - count;
    return (
        <>
            {_.times( n, () =>

                <div className="icon_col disabled" key={n}>
                    <a target="_blank" href={null}>
                        <img src={defaultIconPath} />
                    </a>
                </div>
            )}
        </>

    )
}
*/


export default Preview;

