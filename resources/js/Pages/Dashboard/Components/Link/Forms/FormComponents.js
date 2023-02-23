import React from 'react';
import FormBreadcrumbs from './FormBreadcrumbs';
import FormTabs from './FormTabs';

const FormComponents = () => {

    return (
        <div className="edit_form link my_row">
            <div className="tab_content_wrap my_row">
                <div className="tabs">
                    <FormTabs
                        radioValue={radioValue}
                        setRadioValue={setRadioValue}
                        subStatus={subStatus}
                        inputType={inputType}
                        setInputType={setInputType}
                        currentLink={currentLink}
                        setCurrentLink={setCurrentLink}
                        handleOnClick={handleOnClick}
                        folderID={folderID}
                        integrationType={integrationType}
                        editID={editID}
                        redirectedType={redirectedType}
                    />
                </div>
            </div>
        </div>
    );
};

export default FormComponents;
