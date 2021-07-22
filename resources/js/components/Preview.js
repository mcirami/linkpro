import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import SafesrcDocIframe from 'react-safe-src-doc-iframe';
import Links from './Links';

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


const Preview = ({links, page, count, defaultIconPath}) => {

    return (
        <div className="preview_wrap">

            <div className="inner_content">
                <h2>{page["title"]}</h2>
                <div className="icons_wrap">
                    {links.map((linkItem) => {
                        const { id, url, icon } = linkItem;
                        return (
                            <div className="icon_col" key={id}>
                                <a target="_blank" href={url}>
                                    <img src={icon} />
                                </a>
                            </div>
                        )
                    })}
                    {count < 9 ?
                        <DefaultIcon count={count}
                                     defaultIconPath={defaultIconPath}
                                    />
                        : ""
                    }
                </div>
            </div>
        </div>
    );
}

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


export default Preview;

