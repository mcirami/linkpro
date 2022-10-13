import React, {useState} from 'react';
import ReactCrop from 'react-image-crop';
import IconList from '../IconList';
import InputComponent from './InputComponent';

//TODO: USE THIS COMPONENT FOR REFACTORING THE ICON FORM

const IconForm = ({handleSubmit,iconSelected, setIconSelected }) => {

    const [radioValue, setRadioValue] = useState("standard");
    const [upImg, setUpImg] = useState();

    const selectCustomIcon = e => {
        let files = e.target.files || e.dataTransfer.files;
        if (!files.length) {
            return;
        }
        setIconSelected(true);

        createImage(files[0]);
    }

    const createImage = (file) => {
        let reader = new FileReader();
        reader.onload = (e) => {
            setUpImg(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    return (
        <form onSubmit={handleSubmit} className="link_form">
            <div className="row">
                <div className="col-12">
                    {radioValue === "custom" ?
                        <div className={!iconSelected ?
                            "crop_section hidden" :
                            "crop_section"}>
                            {iconSelected ? <p>Crop Icon</p> : ""}
                            <ReactCrop
                                src={upImg}
                                onImageLoaded={onLoad}
                                crop={crop}
                                onChange={(c) => setCrop(c)}
                                onComplete={(c) => setCompletedIconCrop(c)}
                            />
                            <div className="icon_col">
                                {iconSelected ? <p>Icon Preview</p> : ""}
                                <canvas
                                    ref={iconRef}
                                    // Rounding is important so the canvas width and height matches/is a multiple for sharpness.
                                    style={{
                                        backgroundImage: iconRef,
                                        backgroundSize: `cover`,
                                        backgroundRepeat: `no-repeat`,
                                        width: completedIconCrop ?
                                            `100%` :
                                            0,
                                        height: completedIconCrop ?
                                            `100%` :
                                            0,
                                        borderRadius: `20px`,
                                    }}
                                />
                            </div>
                        </div>
                        :
                        ""
                    }
                    <div className="icon_row">
                        <div className="icon_box">
                            <div className="my_row top">
                                <div className={radioValue === "standard" ? "radio_wrap active" : "radio_wrap" }>
                                    <label htmlFor="standard_radio">
                                        <input id="standard_radio" type="radio" value="standard" name="icon_type"
                                               checked={radioValue === "standard"}
                                               onChange={(e) => {setRadioValue(e.target.value) }}/>
                                        Standard Icons
                                    </label>
                                </div>
                                <div className={radioValue === "custom" ? "radio_wrap active" : "radio_wrap" }>
                                    <label htmlFor="custom_radio">
                                        <input id="custom_radio" type="radio" value="custom" name="icon_type"
                                               onChange={(e) => { setRadioValue(e.target.value) }}
                                               disabled={!subStatus}
                                               checked={radioValue === "custom"}
                                        />
                                        Custom Icons
                                    </label>
                                    {!subStatus && <span className="disabled_wrap" data-type="custom" onClick={(e) => handleOnClick(e)} />}
                                </div>
                                <div className={radioValue === "integration" ? "radio_wrap active" : "radio_wrap" }>
                                    <label htmlFor="integration">
                                        <input id="integration" type="radio" value="integration" name="integration"
                                               onChange={(e) => { setRadioValue(e.target.value) }}
                                               disabled={!subStatus}
                                               checked={radioValue === "integration"}
                                        />
                                        Integrations
                                    </label>
                                    {!subStatus && <span className="disabled_wrap" data-type="integration" onClick={(e) => handleOnClick(e)} />}
                                </div>
                            </div>

                            {radioValue === "custom" ?
                                <div className="uploader">
                                    <label htmlFor="custom_icon_upload" className="custom text-uppercase button blue">
                                        Upload Image
                                    </label>
                                    <input id="custom_icon_upload" type="file" className="custom" onChange={selectCustomIcon} accept="image/png, image/jpeg, image/jpg, image/gif"/>
                                    <div className="my_row info_text file_types text-center mb-2">
                                        <p className="m-0 char_count w-100 ">Allowed File Types: <span>png, jpg, jpeg, gif</span></p>
                                    </div>
                                </div>
                                :
                                <div className="uploader">
                                    <input name="search" type="text" placeholder="Search Icons" onChange={handleChange} defaultValue={input}/>
                                    <div className="my_row info_text file_types text-center mb-2 text-center">
                                        <a href="mailto:help@link.pro" className="mx-auto m-0 char_count">Don't See Your Icon? Contact Us!</a>
                                    </div>
                                </div>
                            }

                            <IconList
                                currentLink={currentLink}
                                setCurrentLink={setCurrentLink}
                                iconArray={iconArray}
                                radioValue={radioValue}
                                setCharactersLeft={setCharactersLeft}
                                customIconArray={customIconArray}
                                setInputType={setInputType}
                            />

                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <div className="input_wrap">
                        <input
                            /*maxLength="13"*/
                            name="name"
                            type="text"
                            value={currentLink.name || ""}
                            placeholder="Link Name"
                            onChange={(e) => handleLinkName(e)}
                            disabled={!subStatus}
                            className={!subStatus ? "disabled" : ""}
                        />
                        {!subStatus && <span className="disabled_wrap" data-type="name" onClick={(e) => handleOnClick(e)}> </span>}
                    </div>
                    <div className="my_row info_text title">
                        <p className="char_max">Max 11 Characters Shown</p>
                        <p className="char_count">
                            {charactersLeft < 0 ?
                                <span className="over">Only 11 Characters Will Be Shown</span>
                                :
                                "Characters Left: " + charactersLeft
                            }
                        </p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <InputComponent
                        inputType={inputType}
                        currentLink={currentLink}
                        setCurrentLink={setCurrentLink}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12 button_row">
                    <button className="button green" type="submit">
                        Save
                    </button>
                    <a href="resources/js/Pages/Dashboard/Components/Link/Forms/NewForm#" className="button transparent gray" onClick={(e) => {
                        e.preventDefault();
                        setShowNewForm(false);
                        document.getElementById('left_col_wrap').style.minHeight = "unset";
                    }}>
                        Cancel
                    </a>
                    <a className="help_link" href="mailto:help@link.pro">Need Help?</a>
                </div>
            </div>
        </form>
    );
};

export default IconForm;
