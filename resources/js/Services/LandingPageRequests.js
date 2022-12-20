import axios from 'axios';
import EventBus from '../Utils/Bus';

/**
 * Submit a request to update landing page logo
 * return object
 */
export const updateImage = (packets, id, elementName) => {

    return axios.post('/course-manager/landing-page/save-image/' + id, packets)
    .then(
        (response) => {
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", { message: returnMessage });

            return {
                success : true,
                imagePath: response.data.imagePath
            }
        }
    )
    .catch((error) => {
        if (error.response !== undefined) {
            if (error.response.data.errors[elementName] !== undefined) {
                EventBus.dispatch("error",
                    {message: error.response.data.errors[elementName][0]});
            }
            console.error("ERROR:: ", error.response.data);
        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false,
        }

    });
}

/**
 * Submit a request to update landing page logo
 * return object
 */
export const updateText = (packets, id, elementName) => {

    return axios.post('/course-manager/landing-page/save-text/' + id, packets)
    .then(
        (response) => {
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", { message: returnMessage });

            return {
                success : true,
            }
        }
    )
    .catch((error) => {
        if (error.response !== undefined) {
            if (error.response.data.errors[elementName] !== undefined) {
                EventBus.dispatch("error",
                    {message: error.response.data.errors["elementName"][0]});
            }
            console.error("ERROR:: ", error.response.data);
        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false,
        }

    });
}

/**
 * Submit a request to update landing page logo
 * return object
 */
export const updateColor = (packets, id, elementName) => {

    return axios.post('/course-manager/landing-page/save-color/' + id, packets)
    .then(
        (response) => {
            const returnMessage = JSON.stringify(response.data.message);
            //EventBus.dispatch("success", { message: returnMessage });

            return {
                success : true,
            }
        }
    )
    .catch((error) => {
        if (error.response !== undefined) {
            if (error.response.data.errors[elementName] !== undefined) {
                EventBus.dispatch("error",
                    {message: error.response.data.errors["elementName"][0]});
            }
            console.error("ERROR:: ", error.response.data);
        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false,
        }

    });
}
