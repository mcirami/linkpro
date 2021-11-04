import React from 'react';
import axios from 'axios';
import EventBus from '../Utils/Bus';
import {MdCheckCircle} from 'react-icons/md';
export const ConfirmPopup = ({editID, setEditID, userLinks, setUserLinks, originalArray, setOriginalArray, setShowConfirmPopup }) => {

    const deleteItem = (e) => {
        e.preventDefault();

        const newArray = userLinks.filter(element => element.id !== editID)
        const packets = {
            userLinks: newArray
        }

        axios.post('/dashboard/links/delete/' + editID, packets).then(
            (response) => {
                //response => console.log(JSON.stringify(response.data)),
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", {message: returnMessage});
                setUserLinks(
                    newArray.map((link, index) => ({...link, position: index}))
                )

                setOriginalArray(
                    newArray.map((link, index) => ({...link, position: index}))
                )
                setEditID(null)
                updateContentHeight();
                setShowConfirmPopup(false)
                document.querySelector('#confirm_popup_link').classList.remove('open');
            }

        ).catch(error => {
            if (error.response) {
                console.log(error.response.data.message);
                EventBus.dispatch("error", { message: error.response.data.message });
            } else {
                console.log("ERROR:: ", error);
            }
        });

    }

    const handleCancel = e => {
        e.preventDefault();
        setShowConfirmPopup(false)
        document.querySelector('#confirm_popup_link').classList.remove('open');
    }

    const updateContentHeight = () => {

        if ((originalArray.length - 1) % 3 === 0 ) {
            const iconsWrap = document.querySelector('.icons_wrap');
            const icons = document.querySelectorAll('.add_icons .icon_col');
            const colHeight = icons[0].clientHeight;
            const rowCount = Math.ceil(icons.length / 3);
            const divHeight = rowCount * colHeight - 40;
            iconsWrap.style.minHeight = divHeight + "px";
        }
    }

    return (

        <>
            <div className="box">
                <div className="icon_wrap check">
                    <MdCheckCircle/>
                </div>
                <h2>Confirm</h2>
                <div className="text_wrap">
                    <p className="confirm_text">Are you sure you want to delete this icon?</p>
                    <form action="" className="button_row">
                        <a className="button green" href="#" onClick={deleteItem}>Yes</a>
                        <a className="button transparent gray" href="#" onClick={handleCancel}>No</a>
                    </form>
                </div>
            </div>
        </>

    )
}
