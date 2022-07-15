import React, {useContext, useRef, useState} from 'react';
import {
    toolTipClick,
    updateProfileLayout,
} from '../../../../Services/PageRequests';
import {PageContext} from '../../App';
import {BiHelpCircle} from 'react-icons/bi';
import {Element} from 'react-scroll';

function PageHeaderLayout({pageHeaderRef, infoIndex, setInfoIndex}) {

    const {pageSettings} = useContext(PageContext);
    const [layout, setLayout] = useState(pageSettings['profile_layout']);
    const infoDiv = useRef();

    const setRadioValue = (value) => {

        const packets = {
            profileLayout: value
        }

        updateProfileLayout(packets, pageSettings['id'])
        .then((response) => {
            console.log(response.message);
            setLayout(value);
        })

        pageHeaderRef.current.id = value;
    }

    console.log(layout);

    return (
        <div className="edit_form">
            <form className="layouts">
                <div className="radio_wrap">
                    <label htmlFor="layout_one">
                        <input type="radio" value="layout_one" name="layout"
                               checked={layout === 'layout_one'}
                               onChange={(e) => {setRadioValue(e.target.value) }}
                        />
                        Layout 1
                    </label>
                    <img src={ Vapor.asset('images/layout-1.png') } alt=""/>
                </div>
                <div className="radio_wrap">
                    <label htmlFor="layout_two">
                        <input type="radio" value="layout_two" name="layout"
                               checked={layout === 'layout_two'}
                               onChange={(e) => {setRadioValue(e.target.value) }}
                        />
                        Layout 2
                    </label>
                    <img src={ Vapor.asset('images/layout-2.png') } alt=""/>
                </div>
                <div className="radio_wrap">
                    <label htmlFor="layout_three">
                        <input type="radio" value="layout_three" name="layout"
                               checked={layout === 'layout_three'}
                               onChange={(e) => {setRadioValue(e.target.value) }}
                        />
                        Layout 3
                    </label>
                    <img src={ Vapor.asset('images/layout-3.png') } alt=""/>
                </div>
            </form>
            <div className="tooltip_icon">
                <div onClick={() => toolTipClick(6, infoIndex, setInfoIndex, infoDiv)} >
                    <BiHelpCircle />
                </div>

                <Element name="infoText5" className={`hover_text help bio ${infoIndex === 6 ? " open" : "" }` } >
                    <div ref={infoDiv}>
                        <p>Choose between 3 different layouts to display your profile content that includes your profile image, title and bio.</p>
                        <h5>Pro Tip!</h5>
                        <p>A longer title and/or bio may look best on Layout 3.</p>
                    </div>
                </Element>
            </div>
        </div>
    );
}

export default PageHeaderLayout;
