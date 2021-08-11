import React, {useState, useEffect} from 'react';
import EventBus from '../Utils/Bus';
import {MdCheckCircle} from 'react-icons/md';

export const Flash = () => {

    const [message, setMessage] = useState('');
    const [visibility, setVisibility] = useState(false);

    useEffect(() => {
        EventBus.on('success', (data) => {
           setVisibility(true);
           setMessage(data.message.replace(/\"/g, ""));

           setTimeout(() => {
               setVisibility(false);
               setMessage('');
           }, 4000);

        });
    }, []);

    useEffect(() => {
        EventBus.remove("success");
    },[])

    return (

        visibility && <div className="display_message alert">
            <div className="icon_wrap">
                <MdCheckCircle/>
            </div>
            <p>{ message }</p>
            <span className="close"><strong>CLOSE</strong></span>
        </div>


    )
}

