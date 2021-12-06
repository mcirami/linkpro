import {PageContext} from '../App';
import React, {useContext, useState} from 'react';
import Switch from 'react-switch';
import {pageStatus} from '../../Services/PageRequests';

const DisablePage = () => {

    const { pageSettings, setPageSettings } = useContext(PageContext);

    const [disabled, setDisabled] = useState(pageSettings['disabled']);

    const handleCheckedChange = () => {


        setDisabled(!disabled);

        const packets = {
            disabled: !disabled,
        };

        pageStatus(packets, pageSettings["id"])
        .then((data) => {

            if (data.success) {

                setPageSettings({
                    ...pageSettings,
                    disabled: !disabled,
                })

            }
        })
    }

    return (
        <div className="status_switch_wrap">
            <form action="">
                <div className="checkbox">
                    <div className="hover_text status_switch"><p>Enable/Disable</p></div>
                    <Switch
                        id="status"
                        name="status"
                        height={20}
                        width={45}
                        checked={!Boolean(disabled)}
                        onColor="#424fcf"
                        onChange={handleCheckedChange}
                        uncheckedIcon={false}
                        checkedIcon={false}
                    />
                </div>
            </form>
        </div>
    )
}

export default DisablePage
