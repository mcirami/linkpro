import { ImPlus } from "react-icons/im";
import {useContext} from 'react';
import {UserLinksContext} from '../../App';

const AddLink = ({subStatus, setShowUpgradePopup, setOptionText, setShowNewForm }) => {

    const { userLinks, setUserLinks } = useContext(UserLinksContext);
    const handleClick = (e) => {
        e.preventDefault();

        const newUserLinks = userLinks.filter(element => !element.type);
        const count = newUserLinks.length;

        if (count < 8 || subStatus ) {

            setShowNewForm(true);

            setTimeout(function(){
                document.querySelector('#scrollTo').scrollIntoView({
                    behavior: 'smooth',
                    block: "start",
                    inline: "nearest"
                });

            }, 800)

        } else {
            setShowUpgradePopup(true);
            setOptionText("add more icons");

            setTimeout(() => {
                document.querySelector('#upgrade_popup .close_popup').addEventListener('click', function(e) {
                    e.preventDefault();
                    setShowUpgradePopup(false);
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
