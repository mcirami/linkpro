import { ImPlus } from "react-icons/im";
import {useContext} from 'react';
import {PageContext, UserLinksContext, OriginalArrayContext} from '../App';
import addLink from '../../../../Services/LinksRequest';

const AddLink = ({userSub, setShowUpgradePopup, setOptionText }) => {

    const { pageSettings, setPageSettings } = useContext(PageContext);
    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const { originalArray, setOriginalArray } = useContext(OriginalArrayContext);

    const handleClick = (e) => {
        e.preventDefault();

        const count = userLinks.length;

        if (count < 8 || ( (userSub && userSub["braintree_status"] === "active") || (userSub && userSub["braintree_status"] === "pending") ) || (userSub && new Date(userSub["ends_at"]).valueOf()) > new Date().valueOf() ) {

            const packets = {
                id: pageSettings["id"],
            };

            addLink(packets)
            .then((data) => {

                if (data.success) {
                    let prevArray = [...originalArray];
                    prevArray = [
                        ...prevArray,
                        {
                            id: data.link_id,
                            name: null,
                            url: null,
                            icon: null,
                            active_status: 1,
                            position: data.position,
                        }
                    ]

                    setOriginalArray(prevArray);
                    setUserLinks(prevArray);

                    updateContentHeight();
                }
            })


        } else {
            const popup = document.querySelector('#upgrade_popup');
            setShowUpgradePopup(true);
            popup.classList.add('open');
            setOptionText("add more icons");

            setTimeout(() => {
                document.querySelector('#upgrade_popup .close_popup').addEventListener('click', function(e) {
                    e.preventDefault();
                    setShowUpgradePopup(false);
                    popup.classList.remove('open');
                });
            }, 500);
        }
    };

    const updateContentHeight = () => {

        if ((originalArray.length + 1) % 4 === 1 ) {

            const iconsWrap = document.querySelector('.icons_wrap');
            const icons = document.querySelectorAll('.add_icons .icon_col');
            const colHeight = icons[0].clientHeight;
            const rowCount = Math.ceil(icons.length / 4);
            const divHeight = rowCount * colHeight - 40;
            iconsWrap.style.minHeight = divHeight + "px";
        }
    }

    return (

        <a href="" className="icon_wrap" onClick={handleClick}>
            <ImPlus />
            <h3>Add Icon</h3>
        </a>

    )
}
export default AddLink;
