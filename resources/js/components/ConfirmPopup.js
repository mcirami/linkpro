import React from 'react';
import axios from 'axios';
import EventBus from '../Utils/Bus';
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
            const iconCol = document.querySelectorAll('.add_icons .icon_col:last-child');
            const colHeight = iconCol[0].offsetHeight;
            const transformProp = iconCol[0].style.transform.split("translate3d(");
            const transformValues = transformProp[1].split(" ");
            const divHeight = transformValues[1].replace(",", "").replace("px", "");
            const height = parseInt(divHeight) + colHeight + 25;
            iconsWrap.style.minHeight = height + "px";
        }
    }

    return (

        <>
            <div className="box">
                <h3 className="popup_title">Confirm</h3>
                <div className="text_wrap">
                    <p>Are you sure you want to delete this icon?</p>
                    <form action="">
                        <a className="button green" href="#" onClick={deleteItem}>Yes</a>
                        <a className="button transparent gray" href="#" onClick={handleCancel}>No</a>
                    </form>
                </div>
            </div>
        </>

    )
}
