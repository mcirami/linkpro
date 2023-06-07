import React, {useEffect, useLayoutEffect, useState} from 'react';
import {isEmpty} from 'lodash';
import PreviewSection from './PreviewSection';
import {PreviewHeight} from '../../../Services/PreviewHooks';

const Preview = ({landingPage}) => {

    const {header_color, header_text_color, hero, logo, sections, slogan} = landingPage;

    useLayoutEffect(() => {

        window.addEventListener('resize', PreviewHeight);
        return () => {
            window.removeEventListener('resize', PreviewHeight);
        }
    }, []);

    useLayoutEffect(() => {
        PreviewHeight()
    }, []);

    return (
        <div className="links_wrap preview">
            <div className="inner_content" id="preview_wrap">
                <div className="inner_content_wrap">
                    {/*<iframe src={landingPage["url"]} ></iframe>*/}
                    <section className="header" id="preview_header_section">
                        <div className="top_section" style={{
                            background: header_color || '#ffffff'
                        }}>
                            <div className="logo">
                                <img src={logo || Vapor.asset("images/logo.png") } alt=""/>
                            </div>
                            <div className="text_wrap">
                                <p style={{color: header_text_color || '#ffffff'}}>{slogan}</p>
                            </div>
                        </div>
                        {hero &&
                            <div className="header_image my_row"
                                 style={{ background: "url(" + hero + ") center 25% no-repeat" }}>
                            </div>
                        }
                    </section>
                    <div className="sections">
                        {!isEmpty(sections) && sections.map((section, index) => {

                            return (
                                <PreviewSection
                                    key={section["id"]}
                                    section={section}
                                />
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preview;
