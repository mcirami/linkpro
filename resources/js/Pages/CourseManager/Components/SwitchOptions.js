import React, {useState} from 'react';
import Switch from '@mui/material/Switch'
import { styled } from '@mui/material/styles';
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

    const IOSSwitch = styled((props) => (
        <Switch {...props} />
    ))(({ theme }) => ({
        width: 58,
        height: 24,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '800ms',
            '&.Mui-checked': {
                transform: 'translateX(34px)',
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
            width: 20,
            height: 20,
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
        <tr key={id}>
            <td>
                {title}
                <a href={`/course-manager/course/${course_id}`}> Edit</a>
            </td>
            <td>
                <IOSSwitch
                    onChange={() => handleChange('active')}
                    checked={Boolean(active)}
                    disabled={!Boolean(published)}
                />
            </td>
            <td>
                <IOSSwitch
                    onChange={() => handleChange('public_offer')}
                    checked={Boolean(public_offer)}
                    disabled={!Boolean(published)}
                />
            </td>
            <td>${price || '0.00'}</td>
            <td>${ (Math.round( (price * .80) * 100) / 100).toFixed(2) }</td>
            <td>${ (Math.round( (price * .40) * 100) / 100).toFixed(2) }</td>
        </tr>
    );
};

export default SwitchOptions;
