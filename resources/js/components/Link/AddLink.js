import { ImPlus } from "react-icons/im";
import axios from 'axios';
import {useContext} from 'react';
import {PageContext} from '../App';
import EventBus from '../../Utils/Bus';

const AddLink = ({userLinks, setUserLinks, originalArray, setOriginalArray }) => {

    const  { pageSettings, setPageSettings } = useContext(PageContext);

    const handleClick = (e) => {
        e.preventDefault();

        const found = userLinks.filter(element => element.id.toString().includes("new"));
        let insertID = null;

        if(found.length > 0) {
            insertID = found[0].id;
        }

        const packets = {
            id : pageSettings["id"],
        };

        axios.post('/dashboard/links/new', packets)
        .then(
            (response) => {
                //console.log(JSON.stringify(response.data));
                const returnMessage = JSON.stringify(response.data.message);
                EventBus.dispatch("success", { message: returnMessage });
                const link_id = JSON.stringify(response.data.link_id);
                const position = response.data.position;
                if (insertID) {
                    setOriginalArray(
                        originalArray.map((item) => {
                            if (item.id === insertID) {
                                return {
                                    id: link_id,
                                    name: null,
                                    url: null,
                                    icon: null,
                                    active_status: 1,
                                    position: position,
                                }
                            }
                            return item;
                        })
                    )
                    setUserLinks(
                        userLinks.map((item) => {

                            if (item.id === insertID) {
                                return {
                                    id: link_id,
                                    name: null,
                                    url: null,
                                    icon: null,
                                    active_status: 1,
                                    position: position,
                                }
                            }

                            return item;
                        })
                    )
                } else {
                    let prevArray = [...originalArray];
                    prevArray = [...prevArray,
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
                }

                updateContentHeight();

            })
        .catch(error => {
            console.log("ERROR:: ", error.response.data);

        });

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
