import React, {useState} from 'react';
import Switch from 'react-switch';
import {updateOfferData} from '../../../Services/OfferRequests';

const SwitchOptions = ({offer}) => {

    const [currentOffer, setCurrentOffer] = useState(offer);
    const {id, title, price, active, public_offer, published, slug, course_id} = currentOffer

    const handleChange = (type) => {
        const value = !currentOffer[type];
        let key = type;

        if(type.includes("_")) {
            key = type.split("_")[0];
        }

        const packets = {
            [`${key}`]: value,
        };

        updateOfferData(packets, id).then((response) => {
            if(response.success) {
                setCurrentOffer((prev) => ({
                    ...prev,
                    [`${type}`]: value,
                }))
            }
        });
    }

    return (
        <tr key={id}>
            <td>
                {title}
                <a href={`/course-manager/course/${course_id}`}> Edit</a>
            </td>
            <td>
                <Switch
                    onChange={() => handleChange('active')}
                    height={20}
                    checked={Boolean(active)}
                    onColor="#424fcf"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    disabled={!Boolean(published)}
                />
            </td>
            <td>
                <Switch
                    onChange={() => handleChange('public_offer')}
                    height={20}
                    checked={Boolean(public_offer)}
                    onColor="#424fcf"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    disabled={!Boolean(published)}
                />
            </td>
            <td>${price || '0.00'}</td>
            <td>${ (Math.round( (price * .80) * 100) / 100).toFixed(2) }</td>
        </tr>
    );
};

export default SwitchOptions;
