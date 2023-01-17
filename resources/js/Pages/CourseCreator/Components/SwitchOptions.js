import React, {useState} from 'react';
import Switch from 'react-switch';
import {updateSectionData} from '../../../Services/LandingPageRequests';
import {updateOfferData} from '../../../Services/OfferRequests';
import {OFFER_ACTIONS} from '../Reducer';

const SwitchOptions = ({offerData, dispatchOffer}) => {

    const [publicValue, setPublicValue] = useState(false);
    const [activeValue, setActiveValue] = useState(false);



    const handleChange = (type) => {

        const value = !offerData[type];

        const packets = {
            [`${type}`]: value,
        };

        updateOfferData(packets, offerData["id"]).then((response) => {
            if(response.success) {
                dispatchOffer({
                    type: OFFER_ACTIONS.UPDATE_OFFER_DATA,
                    payload: {
                        value: value,
                        name: type
                    }
                })
            }
        });
    }

    return (
        <>
            <div className="my_row">
                <div className="switch_wrap page_settings border_wrap">
                    <h3>Public</h3>
                    <Switch
                        onChange={() => handleChange('public')}
                        height={20}
                        checked={Boolean(offerData["public"])}
                        onColor="#424fcf"
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                </div>
            </div>
            <div className="my_row">
                <div className="switch_wrap page_settings border_wrap">
                    <h3>Active</h3>
                    <Switch
                        onChange={() => handleChange('active')}
                        height={20}
                        checked={Boolean(offerData["active"])}
                        onColor="#424fcf"
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                </div>
            </div>
        </>
    );
};

export default SwitchOptions;
