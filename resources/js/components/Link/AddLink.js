import { ImPlus } from "react-icons/im";
import axios from 'axios';
import {useContext} from 'react';
import {PageContext} from '../App';
import EventBus from '../../Utils/Bus';

const AddLink = ({userLinks, setUserLinks }) => {

    const  { pageSettings, setPageSettings } = useContext(PageContext);

    const handleClick = (e) => {
        e.preventDefault();

        const packets = {
            name: "Link Name",
            url: "https://linkurl.com",
            page_id : pageSettings["id"],
        };


        axios.post('/dashboard/links/new', packets)
        .then(
            (response) => {
                //console.log(JSON.stringify(response.data));
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
                const link_id = JSON.stringify(response.data.link_id);
                setUserLinks(
                    userLinks.concat(packets)
                )

            })
        .catch(error => {
            console.log("ERROR:: ", error.response.data);

        });

        setUserLinks(
            userLinks.concat()
        )

    };

    return (
        <div className="add_more_icons">
            <div className="col_left">
                <div className="icon_wrap" onClick={handleClick}>
                    <ImPlus />
                </div>
                <h3>Add More Icons</h3>
            </div>
        </div>
    )
}
export default AddLink;
