import { ImPlus } from "react-icons/im";
import {useContext} from 'react';
import {UserLinksContext} from '../../App';

const AddLink = ({subStatus, setShowUpgradePopup, setOptionText, setShowNewForm, setRadioValue }) => {

    const { userLinks } = useContext(UserLinksContext);
    const handleClick = (e) => {
        e.preventDefault();

        setRadioValue("standard");
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
