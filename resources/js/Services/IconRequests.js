import axios from 'axios';
import EventBus from '../Utils/Bus';

/**
 * Submit a request to get aff offer icons
 * return object
 */
export const getAffIcons = () => {

    return axios.get('/get-aff-icons')
    .then(
        (response) => {
            const iconData = response.data.iconData;
            const authUser = response.data.authUser;

            console.log(response);
            return {
                success : true,
                iconData: iconData,
                authUser: authUser
            }

        })
    .catch(error => {
        if (error.response) {
            //EventBus.dispatch("error", { message: error.response.data.errors.header_img[0] });
            console.error(error.response);
        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false,
        }
    });
}
