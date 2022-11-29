import React, {useEffect, useState} from 'react';
import {SketchPicker} from 'react-color';
import {RiCloseCircleFill} from 'react-icons/ri';

const ColorPicker = () => {

    const [sketchPickerColor, setSketchPickerColor] = useState({
        r: "",
        g: "",
        b: "",
        a: "0",
    });
    // destructuring rgba from state
    const { r, g, b, a } = sketchPickerColor;

    const [showPicker, setShowPicker] = useState(false);
    const [bgColor, setBgColor] = useState({
        background: `url(${Vapor.asset("images/transparent-block.png")})`,
    });

    useEffect(() => {
        setBgColor(
            a == 0 ?
                {background: `url(${Vapor.asset("images/transparent-block.png")})`}
                :
                {background: `rgba(${r} , ${g} , ${b} , ${a})`}
        )

    },[sketchPickerColor])

    return (
        <article className="my_row page_settings mb-0">
            <h4>Top Header Color</h4>
            <div className="icon_wrap">
                <a
                   href="#"
                   onClick={(e) => {
                       e.preventDefault();
                       setShowPicker(!showPicker);
                   }}
                >
                    <span className="color_wrap">
                        <span className="color_box"
                              style={bgColor}>
                        </span>
                    </span>
                    Edit
                </a>
                {showPicker &&
                    <div className="picker_wrapper">
                        <div className="close_icon icon_wrap">
                            <a href="#" onClick={(e) => {
                                e.preventDefault();
                                setShowPicker(false);
                            }}>
                                <RiCloseCircleFill />
                            </a>
                        </div>
                        <SketchPicker
                            onChange={(color) => {
                                setSketchPickerColor(color.rgb);
                            }}
                            color={sketchPickerColor}
                            width={300}
                        />
                    </div>
                }
            </div>
        </article>
    );
};

export default ColorPicker;
