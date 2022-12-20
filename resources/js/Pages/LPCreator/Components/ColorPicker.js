import React, {useEffect, useState} from 'react';
import {SketchPicker} from 'react-color';
import {RiCloseCircleFill} from 'react-icons/ri';
import {updateColor} from '../../../Services/LandingPageRequests';
import {LP_ACTIONS} from '../Reducer';


const ColorPicker = ({
                         label,
                         colors,
                         setColors,
                         elementName,
                         pageData,
                         dispatch,
                         bgColor = null,
                         textColor = null
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
        background: pageData[elementName],
    });

    var timer;

    useEffect(() => {
        /*setPickerBg(
                    a == 0 ?
                        {background: `url(${Vapor.asset("images/transparent-block.png")})`}
                        :
                        {background: `rgba(${r} , ${g} , ${b} , ${a})`}
                )*/
        setPickerBg({background: `rgba(${r} , ${g} , ${b} , ${a})`});

    },[sketchPickerColor])

    useEffect(() => {
        if(bgColor) {
            setPickerBg(
                {background: bgColor}
            );
        } else if(textColor) {
            setPickerBg({background: textColor});
        }
    },[])

    const handleOnChange = (color) => {
        clearTimeout(timer);
        setSketchPickerColor(color);
        const value = `rgba(${color.r} , ${color.g} , ${color.b} , ${color.a})`;
        setColors({
            ...colors,
            [`${elementName}`]: value
        })

        dispatch({
            type: LP_ACTIONS.UPDATE_COLOR,
            payload: {
                value: value,
                name: elementName
            }
        })

        const packets = {
            [`${elementName}`]: value,
        };

        timer = setTimeout(() => {
            updateColor(packets, pageData["id"], elementName)
            .then((response) => {
                if (response.success) {
                    /*dispatch({
                        type: LP_ACTIONS.UPDATE_COLOR,
                        payload: {
                            value: value,
                            name: elementName
                        }
                    })*/
                    console.log("triggered");
                }
            })
        },5000)

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
