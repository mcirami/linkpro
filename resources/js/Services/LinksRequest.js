import axios from 'axios';
import EventBus from '../Utils/Bus';

export const addLink = (packets) => {

    return axios.post('/dashboard/links/new', packets)
    .then(
        (response) => {
            //console.log(JSON.stringify(response.data));
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", {message: returnMessage});
            const link_id = JSON.stringify(response.data.link_id);
            const position = response.data.position;

            return {
                success : true,
                link_id : link_id,
                position : position
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

export const updateLink = (packets, editID) => {

    return axios.post('/dashboard/links/update/' + editID, packets).then(
        (response) => {
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", {message: returnMessage});
            let iconPath = null;

            if(response.data.path) {
                iconPath = response.data.path;
            }

            return {
                success : true,
                iconPath : iconPath
            }
        }
    ).catch(error => {
        if (error.response && error.response.data.errors) {
            if (error.response.data.errors.name !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.name[0] });
            } else if (error.response.data.errors.url !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.url[0] });
            } else if (error.response.data.errors.email !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.email[0] });
            } else if (error.response.data.errors.phone !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.phone[0] });
            } else if (error.response.data.errors.icon !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.icon[0] });
            } else {
                console.log(error.response);
            }

        } else {
            console.log("ERROR:: ", error);
        }

        return {
            success : false,
        }

    });
}

export const updateLinksPositions = (packets) => {

    return axios.post("/dashboard/links/update-positions", packets).then(
        (response) => {
            console.log(JSON.stringify(response.data.message))
        }
    ).catch((error) => {
        console.log("ERROR:: ", error.response.data);
    });

}

export const updateLinkStatus = (packets, itemID) => {

    return axios.post("/dashboard/links/status/" + itemID, packets)
    .then(
        (response) => {
            //console.log(JSON.stringify(response.data))
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", { message: returnMessage });

            return {
                success : true,
            }
        }
    )
    .catch((error) => {
        if (error.response !== undefined) {
            console.log("ERROR:: ", error.response.data);
        } else {
            console.log("ERROR:: ", error);
        }

        return {
            success : false,
        }

    });
}

export const deleteLink = (packets, itemID) => {

    return axios.post('/dashboard/links/delete/' + itemID, packets).then(
        (response) => {
            //response => console.log(JSON.stringify(response.data)),
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", {message: returnMessage});

            return {
                success : true,
            }
        }

    ).catch(error => {
        if (error.response) {
            console.log(error.response.data.message);
            EventBus.dispatch("error", { message: error.response.data.message });
        } else {
            console.log("ERROR:: ", error);
        }

        return {
            success : false,
        }
    });

}

export default addLink;
