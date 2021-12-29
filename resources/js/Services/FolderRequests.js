import axios from 'axios';
import EventBus from '../Utils/Bus';
import {icons} from './IconObjects';


/**
 * Submit a request to add a new link
 * return object
 */
export const addFolder = (packets) => {

    return axios.post('/folder/new', packets)
    .then(
        (response) => {
            //console.log(JSON.stringify(response.data));
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", {message: returnMessage});
            const folder_id = response.data.id;
            const position = response.data.position;

            return {
                success : true,
                id: folder_id,
                position : position,
            }

        })
    .catch(error => {
        if (error.response) {
            //EventBus.dispatch("error", { message: error.response.data.errors.header_img[0] });
            console.log(error.response);
        } else {
            console.log("ERROR:: ", error);
        }

        return {
            success : false,
        }
    });
}

export default addFolder;
