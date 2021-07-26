import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import SafesrcDocIframe from "react-safe-src-doc-iframe";
import Links from "./Links";

/*

const html = `
<!DOCTYPE html>
  <html>
    <head>
      <title>My Cats Page</title>
    </head>
    <style>
        .inner_content {
    	    background: user.background ;
    	    height: 600px;
    	    width: 100%;
        }
    </style>
      <div class="inner_content">
      <h2>Hello There!</h2>
                    </div>
  </body>
  </html>

`;
*/
const page_header_path = user.page_header_path;
const page_profile_path = user.page_profile_path;

const Preview = ({ links, page, count, defaultIconPath }) => {
    const currentPageHeader = page_header_path + "/" + page["header_img"];
    const currentPageProfileIMG = page_profile_path + "/" + page["profile_img"];

    return (
        <div className="preview_wrap">
            <div className="inner_content">
                <div className="page_header">
                    <img src={currentPageHeader} />
                </div>
                <div className="profile_section">
                    <div className="image_col">
                        <img src={currentPageProfileIMG} />
                    </div>
                    <div className="content_col">
                        <h2>{page["title"]}</h2>
                        <p>{page["bio"]}</p>
                    </div>
                </div>

                <div className="icons_wrap">
                    {links.map((linkItem) => {
                        const { id, url, icon, active_status } = linkItem;
                        return (
                            <div key={id || Math.random()}>
                                {active_status ? (
                                    <div className="icon_col">
                                        <a target="_blank" href={url}>
                                            <img src={icon} />
                                        </a>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        );
                    })}
                    {count < 9 ? (
                        <DefaultIcon
                            count={count}
                            defaultIconPath={defaultIconPath}
                        />
                    ) : (
                        ""
                    )}
                </div>
            </div>
        </div>
    );
};

const DefaultIcon = ({ count, defaultIconPath }) => {
    let n = 9 - count;
    return (
        <>
            {_.times(n, () => (
                <div className="icon_col disabled" key={n}>
                    <a target="_blank" href={null}>
                        <img src={defaultIconPath} />
                    </a>
                </div>
            ))}
        </>
    );
};

export default Preview;
