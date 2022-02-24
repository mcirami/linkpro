import { ImPlus } from "react-icons/im";
import {useContext} from 'react';
import {UserLinksContext} from '../App';

const AddLink = ({userSub, setShowUpgradePopup, setOptionText, setShowNewForm }) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const handleClick = (e) => {
        e.preventDefault();

        const count = userLinks.length;

        if (count < 8 || ( (userSub && userSub["braintree_status"] === "active") || (userSub && userSub["braintree_status"] === "pending") ) || (userSub && new Date(userSub["ends_at"]).valueOf()) > new Date().valueOf() ) {

            setShowNewForm(true);

            setTimeout(function(){
                document.querySelector('#scrollTo').scrollIntoView({
                    behavior: 'smooth',
                    block: "start",
                    inline: "nearest"
                });

            }, 800)

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

    return (

        <a href="" className="icon_wrap" onClick={handleClick}>
            <ImPlus />
            <h3>Add Icon</h3>
        </a>

    )
}
export default AddLink;
