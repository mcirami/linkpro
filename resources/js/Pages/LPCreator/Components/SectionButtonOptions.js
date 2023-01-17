import React, {createRef, useEffect, useState} from 'react';
import Switch from 'react-switch';
import {updateSectionData} from '../../../Services/LandingPageRequests';

const SectionButtonOptions = ({
                                  position,
                                  buttonPosition,
                                  includeButton,
                                  sections,
                                  setSections,
                                  id
}) => {

    const [includeButtonValue, setIncludeButtonValue] = useState(false);
    const [buttonPositionValue, setButtonPositionValue] = useState("above");

    useEffect(() => {
        setIncludeButtonValue(includeButton)
    },[])

    useEffect(() => {
        setButtonPositionValue(buttonPosition)
    },[])

    const handleSwitchChange = () => {
        setIncludeButtonValue(!includeButtonValue);

        const packets = {
            button: !includeButtonValue,
        };

        updateSectionData(packets, id).then((response) => {
            if(response.success) {
                setSections(
                    sections.map((section) => {
                        if(section.id === id) {
                            section.button = !includeButtonValue;
                        }

                        return section;
                    })
                )
            }
        });
    }

    const handleRadioChange = (value) => {
        setButtonPositionValue(value);

        const packets = {
            button_position: value,
        };

        updateSectionData(packets, id).then((response) => {
            if(response.success) {
                setSections(
                    sections.map((section) => {
                        if(section.id === id) {
                            section.button_position = value;
                        }

                        return section;
                    })
                )
            }
        });
    }

    return (
        <div className="button_options">
            <div className="switch_wrap page_settings border_wrap">
                <h3>Include Button</h3>
                <Switch
                    onChange={handleSwitchChange}
                    height={20}
                    checked={Boolean(includeButtonValue)}
                    onColor="#424fcf"
                    uncheckedIcon={false}
                    checkedIcon={false}
                />
            </div>
            <div className="radios_wrap page_settings border_wrap">
                <h3>Button Location</h3>
                <div className="radios">
                    <div className={`single_radio`}>
                        <label htmlFor={`section_${position}_above`}>
                            <input id={`section_${position}_above`} type="radio" value="above" name={`section_${position}_button_placement`}
                                   checked={ (buttonPositionValue === "above" || !buttonPositionValue) && "checked"}
                                   onChange={(e) => {handleRadioChange(e.target.value)}}
                            />
                            Above
                        </label>
                    </div>
                    <div className={`single_radio`}>
                        <label htmlFor={`section_${position}_below`}>
                            <input id={`section_${position}_below`} type="radio" value="below" name={`section_${position}_button_placement`}
                                   checked={buttonPositionValue === "below" && "checked"}
                                   onChange={(e) => {handleRadioChange(e.target.value)}}
                            />
                            Below
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SectionButtonOptions;
