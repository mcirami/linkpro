import React, {useEffect, useState} from 'react';
import {updateSectionData} from '../../../Services/CourseRequests';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import Slider from '@mui/material/Slider';
import ColorPicker from './ColorPicker';
import InputComponent from './InputComponent';
import Switch from '@mui/material/Switch'
import { styled } from '@mui/material/styles';

const SectionButtonOptions = ({
                                  position,
                                  sections,
                                  setSections,
                                  currentSection,
                                  id
}) => {

    const {
        button_position,
        button,
        button_text,
        button_size
    } = currentSection;

    const [includeButtonValue, setIncludeButtonValue] = useState(false);
    const [buttonPositionValue, setButtonPositionValue] = useState("above");
    const [buttonSizeState, setButtonSizeState] = useState(button_size);

    useEffect(() => {
        setIncludeButtonValue(button)
    },[])

    useEffect(() => {
        setButtonPositionValue(button_position)
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

    const handleRangeChange = (value) => {
        setButtonSizeState(value)
    }

    const submitButtonSize = () => {
        const packets = {
            button_size: buttonSizeState,
        };

        updateSectionData(packets, id).then((response) => {
            if(response.success) {
                setSections(
                    sections.map((section) => {
                        if(section.id === id) {
                            section.button_size = buttonSizeState;
                        }

                        return section;
                    })
                )
            }
        });
    }

    const rangePercent = (value) => {
        return value + "%";
    }

    const IOSSwitch = styled((props) => (
        <Switch {...props} />
    ))(({ theme }) => ({
        width: 62,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '800ms',
            '&.Mui-checked': {
                transform: 'translateX(35px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: '#424fcf',
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#ffffff',
                border: '6px solid #ffffff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color: '#ffffff',
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            color: '#ffffff',
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: theme.palette.mode === 'light' ? 'rgb(136, 136, 136)' : '#39393D',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    }));

    return (
        <>
            <div className={`switch_wrap page_settings border_wrap ${!button ? "mb-4" : "" }`}>
                <h3>Include Button</h3>
                <IOSSwitch
                    onChange={handleSwitchChange}
                    checked={Boolean(includeButtonValue)}
                />
            </div>
            <div className={`button_options ${includeButtonValue ? "open" : ""}`}>
                <article className="page_settings border_wrap">
                    <div className="radios_wrap">
                        <FormControl>
                            <FormLabel
                                id={`section_${position}_above`}
                                sx={{
                                    color: '#000'
                                }}
                            >
                                <h3>Button Location</h3>
                            </FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby={`section_${position}_above`}
                                name={`section_${position}_above`}
                                onChange={(e) => {handleRadioChange(e.target.value)}}
                            >
                                <FormControlLabel
                                    value="above"
                                    control={
                                        <Radio
                                            checked={ (buttonPositionValue === "above" || !buttonPositionValue) && true}
                                        />}
                                    label="Above"
                                />
                                <FormControlLabel
                                    value="below"
                                    control={
                                        <Radio
                                            checked={buttonPositionValue === "below" && true}
                                        />}
                                    label="Below"
                                />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </article>
                <article className="my_row page_settings border_wrap">
                    <h3>Button Size</h3>
                    <div className="slider_wrap">
                        <Slider
                            value={buttonSizeState}
                            aria-label="Default"
                            valueLabelDisplay="auto"
                            valueLabelFormat={rangePercent}
                            color="primary"
                            step={1}
                            min={25}
                            max={100}
                            sx={{
                                color: '#424fcf'
                            }}
                            onChange={(e) => handleRangeChange(e.target.value)}
                            onChangeCommitted={submitButtonSize}
                        />
                    </div>
                </article>
                <ColorPicker
                    label="Button Text Color"
                    sections={sections}
                    setSections={setSections}
                    currentSection={currentSection}
                    elementName={`section_${position}_button_text_color`}
                />
                <ColorPicker
                    label="Button Color"
                    sections={sections}
                    setSections={setSections}
                    currentSection={currentSection}
                    elementName={`section_${position}_button_color`}
                />
                <InputComponent
                    placeholder="Update Button Text (optional)"
                    type="text"
                    maxChar={15}
                    hoverText="Submit Button Text"
                    elementName={`section_${position}_button_text`}
                    sections={sections}
                    setSections={setSections}
                    currentSection={currentSection}
                    value={button_text}
                />
            </div>
        </>
    );
};

export default SectionButtonOptions;
