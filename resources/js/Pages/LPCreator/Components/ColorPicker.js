import React, {useEffect, useState} from 'react';
import {SketchPicker} from 'react-color';
import {RiCloseCircleFill} from 'react-icons/ri';


const ColorPicker = ({
                         label,
                         colors,
                         setColors,
                         type
}) => {

    const [sketchPickerColor, setSketchPickerColor] = useState({
        r: "",
        g: "",
        b: "",
        a: "0",
    });
    // destructuring rgba from state
    const { r, g, b, a } = sketchPickerColor;

    const [showPicker, setShowPicker] = useState(false);
    const [pickerBg, setPickerBg] = useState({
        background: `url(${Vapor.asset("images/transparent-block.png")})`,
    });

    useEffect(() => {
        setPickerBg(
            a == 0 ?
                {background: `url(${Vapor.asset("images/transparent-block.png")})`}
                :
                {background: `rgba(${r} , ${g} , ${b} , ${a})`}
        )

    },[sketchPickerColor])

    const handleOnChange = (color) => {
        setSketchPickerColor(color);
        setColors({
            ...colors,
            [`${type}`]: `rgba(${color.r} , ${color.g} , ${color.b} , ${color.a})`
        })
    }

    return (
        <article className="my_row page_settings border_wrap">
            <h4>{label}</h4>
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
                              style={pickerBg}>
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
                                handleOnChange(color.rgb);
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
