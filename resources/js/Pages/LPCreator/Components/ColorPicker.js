import React, {useEffect, useState} from 'react';
import {SketchPicker} from 'react-color';
import {RiCloseCircleFill} from 'react-icons/ri';
import {
    updateData,
    updateSectionData,
} from '../../../Services/LandingPageRequests';
import {LP_ACTIONS} from '../Reducer';


const ColorPicker = ({
                         label,
                         elementName,
                         pageData = null,
                         dispatch = null,
                         sections = null,
                         setSections = null,
                         currentSection = null
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
    const [pickerBg, setPickerBg] = useState({});

    var timer = 0;

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

        if(currentSection) {
            let element = elementName.split(/(\d+)/);
            element = element[2].replace('_', '');

            let color;
            if(element === "text_color" && !currentSection[element]) {
                color = 'rgba(0,0,0,1)';
            } else if (element === "bg_color" && !currentSection[element]) {
                color = 'rgba(255,255,255,1)';
            } else {
                color = currentSection[element];
            }

            setPickerBg({background: color});
        } else {
            setPickerBg({ background: pageData[elementName] })
        }

    },[])

    useEffect(() => {
        // "timer" will be undefined again after the next re-render
        return () => clearTimeout(timer);
    }, []);

    const handleOnChange = (color) => {
        setSketchPickerColor(color);
        const value = `rgba(${color.r} , ${color.g} , ${color.b} , ${color.a})`;
        if(sections) {

            let element = elementName.split(/(\d+)/);
            element = element[2].replace('_', '');

            setSections(sections.map((section) => {
                if (section.id === currentSection.id) {
                    return {
                        ...section,
                        [`${element}`]: value,
                    }
                }
                return section;
            }))

            const packets = {
                [`${element}`]: value,
            };

            updateSectionData(packets, currentSection.id)
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
            });

        } else {

            dispatch({
                type: LP_ACTIONS.UPDATE_PAGE_DATA,
                payload: {
                    value: value,
                    name: elementName
                }
            })

            const packets = {
                [`${elementName}`]: value,
            };

            timer = setTimeout(() => {
                updateData(packets, pageData["id"], elementName)
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

            console.log("timer: ", timer);
        }


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
