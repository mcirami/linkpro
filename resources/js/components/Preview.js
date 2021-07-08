import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import SafesrcDocIframe from 'react-safe-src-doc-iframe';
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


const Preview = ({links, userInfo}) => {

    return (
        <div className="preview_wrap">

            <div className="inner_content" style={{ background: userInfo.background, height: "600px", width: "100%" }}>
                <h2>{userInfo.username}</h2>
                <div className="icons_wrap">
                    {links.map((linkItem) => {
                        const { id, link, link_icon } = linkItem;
                        return (
                            <div className="icon_col" key={id}>
                                <a target="_blank" href={link}>
                                    <img src={link_icon} />
                                </a>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}


export default Preview;

