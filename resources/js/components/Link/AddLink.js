import { ImPlus } from "react-icons/im";
import axios from 'axios';
import {useContext} from 'react';
import {PageContext} from '../App';
import EventBus from '../../Utils/Bus';

const AddLink = ({userLinks, setUserLinks, originalArray, setOriginalArray, userSub, setShowPopup, setOptionText }) => {

    const  { pageSettings, setPageSettings } = useContext(PageContext);

    const handleClick = (e) => {
        e.preventDefault();

        const count = userLinks.length;

        if (count < 9 || (userSub && userSub["braintree_status"] === "active") || (userSub && new Date(userSub["ends_at"]).valueOf()) > new Date().valueOf() ) {

            const packets = {
                id: pageSettings["id"],
            };

            axios.post('/dashboard/links/new', packets).then(
                (response) => {
                    //console.log(JSON.stringify(response.data));
                    const returnMessage = JSON.stringify(response.data.message);
                    EventBus.dispatch("success", {message: returnMessage});
                    const link_id = JSON.stringify(response.data.link_id);
                    const position = response.data.position;
                        let prevArray = [...originalArray];
                        prevArray = [
                            ...prevArray,
                            {
                                id: link_id,
                                name: null,
                                url: null,
                                icon: null,
                                active_status: 1,
                                position: position,
                            }
                        ]

                        setOriginalArray(prevArray);
                        setUserLinks(prevArray)


                    updateContentHeight();

                }).catch(error => {
                console.log("ERROR:: ", error.response.data);

            });
        } else {
            const popup = document.querySelector('#upgrade_popup');
            setShowPopup(true);
            popup.classList.add('open');
            setOptionText("add more icons");

            setTimeout(() => {
                document.querySelector('#upgrade_popup .close_popup').addEventListener('click', function(e) {
                    e.preventDefault();
                    setShowPopup(false);
                    popup.classList.remove('open');
                });
            }, 500);
        }

    };

    const updateContentHeight = () => {

        if ((originalArray.length + 1) % 3 === 1 ) {
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

        <div className="icon_wrap" onClick={handleClick}>
            <ImPlus />
            <h3>Add Icon</h3>
        </div>

    )
}
export default AddLink;
