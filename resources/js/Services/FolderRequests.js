import axios from 'axios';
import EventBus from '../Utils/Bus';

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

/**
 * Submit a request to delete folder
 * return object
 */
export const deleteFolder = (packets, folderID) => {

    return axios.post('/dashboard/folder/delete/' + folderID, packets)
    .then(
        (response) => {
            //console.log(JSON.stringify(response.data));
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", {message: returnMessage});

            return {
                success : true,
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

export const updateFolderName = (folderID, packets) => {

    return axios.post('/dashboard/folder/update-name/' + folderID, packets)
    .then(
        (response) => {
            //console.log(JSON.stringify(response.data));
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", {message: returnMessage});

            return {
                success : true,
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

export const fetchFolderLinks = async (linkID) => {
    const url = 'folder/links/' + linkID;
    const response = await fetch(url);
    const folderLinks = await response.json();

    setOriginalFolderLinks(folderLinks["links"]);
    setFolderLinks(folderLinks["links"]);
    setEditFolderID(linkID);

    setTimeout(function(){
        document.querySelector('#scrollTo').scrollIntoView({
            behavior: 'smooth',
            block: "start",
            inline: "nearest"
        });

    }, 800)

}

export default addFolder;
