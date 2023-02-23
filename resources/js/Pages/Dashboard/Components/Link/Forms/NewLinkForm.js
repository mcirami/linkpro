import React from 'react';
import IconList from '../IconList';
import InputTypeRadio from './InputTypeRadio';
import InputComponent from './InputComponent';

const NewLinkForm = () => {
    return (
        <form onSubmit={handleSubmit} className="link_form">
            <div className="row">
                <div className="col-12">
                    <div className="icon_row">
                        <div className="icon_box">
                            <div className="uploader">
                                <input name="search" type="text" placeholder="Search Icons" onChange={handleChange} defaultValue={searchInput}/>
                                <div className="my_row info_text file_types text-center mb-2 text-center">
                                    <a href="mailto:help@link.pro" className="mx-auto m-0 char_count">Don't See Your Icon? Contact Us!</a>
                                </div>
                            </div>
                            <IconList
                                currentLink={currentLink}
                                setCurrentLink={setCurrentLink}
                                iconArray={iconArray}
                                radioValue={radioValue}
                                setCharactersLeft={setCharactersLeft}
                                customIconArray={customIconArray}
                                inputType={inputType}
                                setInputType={setInputType}
                                editID={editID}
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
                            value={currentLink.name ||
                                ""}
                            placeholder="Link Name"
                            onChange={(e) => handleLinkName(
                                e)}
                            disabled={!subStatus}
                            className={!subStatus ? "disabled" : ""}
                        />
                        {!subStatus &&
                            <span className="disabled_wrap"
                                  data-type="name"
                                  onClick={(e) => handleOnClick(e)}>
                                                    </span>
                        }
                    </div>
                    <div className="my_row info_text title">
                        <p className="char_max">Max 11 Characters Shown</p>
                        <p className="char_count">
                            {charactersLeft < 0 ?
                                <span className="over">Only 11 Characters Will Be Shown</span>
                                :
                                "Characters Left: " +
                                charactersLeft
                            }
                        </p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <InputTypeRadio
                        inputType={inputType}
                        setInputType={setInputType}
                        currentLink={currentLink}
                        setCurrentLink={setCurrentLink}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <InputComponent
                        inputType={inputType}
                        setInputType={setInputType}
                        currentLink={currentLink}
                        setCurrentLink={setCurrentLink}
                        lists={lists}
                        setLists={setLists}
                        shopifyStores={shopifyStores}
                        setShowAddStore={setShowAddStore}
                        allProducts={allProducts}
                        setAllProducts={setAllProducts}
                        selectedProducts={selectedProducts}
                        setSelectedProducts={setSelectedProducts}
                        displayAllProducts={displayAllProducts}
                        setDisplayAllProducts={setDisplayAllProducts}
                        integrationType={integrationType}
                        setIntegrationType={setIntegrationType}
                        setShowLoader={setShowLoader}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-12 button_row">
                    <button className="button green" type="submit">
                        Save
                    </button>
                    <a href="#" className="button transparent gray" onClick={(e) => handleCancel(e)}>
                        Cancel
                    </a>
                    <a className="help_link" href="mailto:help@link.pro">Need Help?</a>
                </div>
            </div>
        </form>
    );
};

export default NewLinkForm;
