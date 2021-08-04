import React, {useContext} from 'react';
import {MdEdit} from "react-icons/md";
import {LinksContext, PageContext} from './App';

//const page_header_path  = user.page_header_path + "/";
//const page_profile_path  = user.page_profile_path + "/";

const Preview = ({setUserLinks, userLinks}) => {

    //const { userLinks } = useContext(LinksContext);
    const { pageSettings, setPageSettings } = useContext(PageContext);

    const myStyle = {
        background: "url(" + pageSettings["header_img"] + ") no-repeat",
        backgroundSize: "cover",
    };

    return (

        <div className="preview_wrap">
            <div className="inner_content">

                {pageSettings["header_img"] ?
                    <div className="page_header"
                         style={myStyle}
                    >
                    </div>
                    :
                    <div className={!pageSettings["header_img"] ? "page_header default" : "page_header" }>
                        <MdEdit />
                    </div>
                }
                <div className="profile_content">
                    <div className={!pageSettings["profile_img"] ? "profile_image default" : "profile_image"  }>
                        {pageSettings["profile_img"] ?
                            <img src={pageSettings["profile_img"]} alt=""/>
                            :
                            <MdEdit />
                        }
                    </div>
                    <div className="profile_text">
                        <h2>{pageSettings["title"]}</h2>
                        <p>{pageSettings["bio"]}</p>
                    </div>
                </div>
                <div className="icons_wrap">
                    {userLinks.map((linkItem) => {
                        const { id, url, icon, active_status } = linkItem;
                        return (
                            <>
                                { active_status ?
                                    <div className="icon_col" key={ id || Math.random()}>
                                        <a target="_blank" href={url}>
                                            <img src={icon} />
                                        </a>
                                    </div>
                                 : "" }
                             </>
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

