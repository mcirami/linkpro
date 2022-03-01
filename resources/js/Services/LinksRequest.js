import axios from 'axios';
import EventBus from '../Utils/Bus';
import {icons} from './IconObjects';
import getWindow from '@popperjs/core/lib/dom-utils/getWindow';

/**
 * Submit a request to add a new link
 * return object
 */
export const addLink = (packets) => {

    return axios.post('/dashboard/links/new', packets)
    .then(
        (response) => {
            //console.log(JSON.stringify(response.data));
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", {message: returnMessage});
            const link_id = response.data.link_id;
            const position = response.data.position;
            let icon_path = null;
            if (response.data.iconPath) {
                icon_path = response.data.iconPath;
            }

            return {
                success : true,
                link_id : link_id,
                position : position,
                icon_path : icon_path
            }

        })
    .catch(error => {
        if (error.response) {
            if (error.response.data.errors.icon !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.icon[0] });
            } else if (error.response.data.errors.name !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.name[0] });
            } else if (error.response.data.errors.url !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.url[0] });
            } else if (error.response.data.errors.email !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.email[0] });
            } else if (error.response.data.errors.phone !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.phone[0] });
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

/**
 * Submit a request to update a link's content
 * return object
 */
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
        if (error.response) {
            if (error.response.data.errors.icon !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.icon[0] });
            } else if (error.response.data.errors.name !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.name[0] });
            } else if (error.response.data.errors.url !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.url[0] });
            } else if (error.response.data.errors.email !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.email[0] });
            } else if (error.response.data.errors.phone !== undefined) {
                EventBus.dispatch("error", { message: error.response.data.errors.phone[0] });
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

/**
 * Submit a request to update a links position after drag and drop
 */
export const updateLinksPositions = (packets) => {

    return axios.post("/dashboard/links/update-positions", packets).then(
        (response) => {
            console.log(JSON.stringify(response.data.message))
        }
    ).catch((error) => {
        console.log("ERROR:: ", error.response.data);
    });

}

/**
 * Submit a request to update a link
 * return object
 */
export const updateLinkStatus = (packets, itemID, url) => {

    return axios.post(url + itemID, packets)
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

/**
 * Submit a request to delete a link
 * return object
 */

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

export const checkURL = (url, name, custom, subStatus) => {

    if (custom) {

        return checkForHttp(url);

    } else {

        let icon = icons.find(icon => icon.name === name);

        if (icon && icon.required_in_url && subStatus) {
            if (url.toLowerCase().includes(icon.required_in_url)) {

                const returnURL = checkForHttp(url);

                return {
                    success: true,
                    url: returnURL
                }

            } else {

                EventBus.dispatch("error",
                    {message: "URL does not match Icon selected"});

                return {
                    success: false,
                }
            }
        } else {
            const returnURL = checkForHttp(url);

            return {
                success: true,
                url: returnURL
            }
        }
    }
}

export const updateContentHeight = ( linkArray ) => {

    if ((linkArray.length + 1) % 4 === 1 ) {

        const iconsWrap = document.querySelector('.icons_wrap');
        const icons = document.querySelectorAll('.add_icons .icon_col');
        const colHeight = icons[0].clientHeight;
        const rowCount = Math.ceil(icons.length / 4);
        const divHeight = rowCount * colHeight - 40;
        iconsWrap.style.minHeight = divHeight + "px";
    }
}

const checkForHttp = (url) => {

    let returnURL = null;

    if (url.includes('https://')) {
        returnURL = url;
    } else {
        returnURL = 'https://' + url;
    }

    return returnURL;

}

export const getAllLinks = (pageID) => {

    return axios.get('/dashboard/page/get-links/' + pageID).then(
        (response) => {
            //response => console.log(JSON.stringify(response.data)),
            const userLinks = response.data.userLinks;

            return {
                success : true,
                userLinks: userLinks
            }
        }

    ).catch(error => {
        if (error.response) {
            console.log(error.response.data.message);
            //EventBus.dispatch("error", { message: error.response.data.message });
        } else {
            console.log("ERROR:: ", error);
        }

        return {
            success : false,
        }
    });
}

export const getColHeight = (initialRender) => {

    const windowWidth = window.outerWidth;
    const iconCol = document.querySelectorAll('.icons_wrap.add_icons .icon_col');
    let colHeight;
    const offsetHeight = iconCol[0].clientHeight;

    console.log(offsetHeight);

    /*if (initialRender.current) {*/

        colHeight = offsetHeight - 15;

        /*if (windowWidth > 1500) {
            colHeight = 230;
        } else if (windowWidth > 1300) {
            colHeight = (windowWidth/2) * .30 + 10;
        } else if (windowWidth > 1200) {
            colHeight = (windowWidth/2) * .30 + 20;
        } else if (windowWidth > 1100) {
            colHeight = (windowWidth/2) * .30 + 30;
        } else if (windowWidth > 992) {
            colHeight = (windowWidth/2) * .30 + 40;
        } else if (windowWidth > 815) {
            colHeight = (windowWidth/2) * .45 + 40;
        } else if (windowWidth > 600) {
            colHeight = (windowWidth/2) * .45 + 50;
        } else if (windowWidth > 500) {
            colHeight = (windowWidth/2) * .45 + 55;
        } else {
            colHeight = (windowWidth/2) * .45 + 60;
        }*/
    /*} else {
        //colHeight = offsetHeight - 15;
    }*/

    return colHeight;
}

export const getColWidth = (type) => {
    const windowWidth = window.outerWidth;
    let colWidth;
    const iconsWrap = document.querySelector('.icons_wrap.add_icons');

    if (iconsWrap) {

        if (type === "main") {

            if (windowWidth < 500) {
                colWidth = (iconsWrap.clientWidth / 4) - 7;
            } else {
                colWidth = (iconsWrap.clientWidth / 4) - 10;
            }

        } else {
            if (windowWidth < 500) {
                colWidth = (iconsWrap.clientWidth / 3) - 10;
            } else {
                colWidth = (iconsWrap.clientWidth / 3) - 15;
            }

            /*if (iconsWrap) {*/

            /*} else {
                if (windowWidth < 992) {
                    colWidth = (windowWidth / 3) - 20;
                } else if (windowWidth < 1500) {
                    colWidth = (windowWidth * .396633) / 3 + 20;
                } else {
                    colWidth = 275;
                }
            }*/
        }

        /*if (windowWidth < 550) {
            colWidth = (windowWidth / 4) - 28;
        } else if (windowWidth < 768) {
            colWidth = (windowWidth / 4) - 30;
        } else {
            colWidth = (iconsWrap.clientWidth / 4) - 15;
        }*/
    } /*else {
        if (windowWidth < 768) {
            colWidth = (windowWidth / 4) - 30;
        } else if (windowWidth < 992) {
            colWidth = (windowWidth / 4) - 20;
        } else if (windowWidth < 1500) {
            colWidth = (windowWidth * .396633) / 4 + 20;
        } else {
            colWidth = 175;
        }
    }*/

    return colWidth;
}

export default addLink;
