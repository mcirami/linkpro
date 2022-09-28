import axios from 'axios';
import EventBus from '../Utils/Bus';
import { Link, scroller } from  'react-scroll';
import data from '../Pages/Dashboard/data';
import {useEffect} from 'react';

export const addPage = (packets) => {

    return axios.post('/dashboard/page/new', packets).then(
        (response) => {
            //console.log(JSON.stringify(response.data));
            const page_id = JSON.stringify(response.data.page_id);
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", { message: returnMessage });

            return {
                success : true,
                page_id : page_id,
            }
        },

    ).catch(error => {
        if (error.response) {
            if(error.response.data.errors.name) {
                EventBus.dispatch("error", { message: error.response.data.errors.name[0] });
            } else {
                console.error(error.response);
            }

        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}

export const passwordProtect = (packets, pageID) => {

    return axios.post('/dashboard/page/update-password/' + pageID,
        packets).then(
        (response) => {
            //console.log(JSON.stringify(response.data))
            const returnMessage = JSON.stringify(response.data.message);
            //const message = returnMessage.toString();
            EventBus.dispatch("success", {message: returnMessage});

            return {
                success : true,
            }
        }
    ).catch(error => {
        if (error.response) {
            EventBus.dispatch("error",
                {message: error.response.data.errors.password[0]});
        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }
    })
}

export const passwordStatus = (packets, pageID, type, checked) => {

    return axios.post('/dashboard/page/update-password/' + pageID,
        packets).then(
        (response) => {
            //console.log(JSON.stringify(response.data))
            //const returnMessage = JSON.stringify(response.data.message);
            let returnMessage;

            if (type === null) {
                if (!checked) {
                    returnMessage = "Page Password Enabled";
                } else {
                    returnMessage = "Page Password Disabled";
                }

                EventBus.dispatch("success", {message: returnMessage});
            }

            return {
                success : true
            }

        }
    ).catch(error => {
        //console.error("ERROR:: ", error.response.data);
        if (error.response) {
            EventBus.dispatch("error",
                {message: error.response.data.errors.is_protected[0]});
        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }
    })
}

export const updatePageName = (packets, pageID) => {

    return axios.post('/dashboard/page/update-name/' + pageID,
        packets).then(
        (response) => {
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", {message: returnMessage});

            return {
                success : true,
            }
        }
    ).catch((error) => {
        if (error.response) {
            if (error.response.data.errors) {
                EventBus.dispatch("error", { message: error.response.data.errors.name[0] });
            } else {
                console.error(error.response);
            }
        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }

    });
}

export const headerImage = (packets, pageID) => {

    return axios.post('/dashboard/page/update-header-image/' + pageID, packets)
    .then(
        (response) => {
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", { message: returnMessage });

            return {
                success : true,
            }
        }
    ).catch(error => {
        if (error.response) {
            EventBus.dispatch("error", { message: error.response.data.errors.header_img[0] });
            console.error(error.response);
        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}

export const profileImage = (packets, pageID, pageDefault) => {

    return axios.post('/dashboard/page/update-profile-image/' + pageID, packets)
    .then(
        (response) => {
            //console.log(JSON.stringify(response.data))
            const returnMessage = JSON.stringify(response.data.message);
            const imgPath = response.data.imgPath;

            EventBus.dispatch("success", { message: returnMessage });

            if(pageDefault){

                document.querySelector('#user_image').src = imgPath;
                document.querySelector('#mobile_user_image').src = imgPath;
            }

            return {
                success : true,
            }

        }
    ).catch(error => {
        if (error.response) {
            EventBus.dispatch("error", { message: error.response.data.errors.profile_img[0] });
        } else {
            console.error("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}

export const pageTitle = (packets, pageID) => {

    return axios.post('/dashboard/page/update-title/' + pageID,
        packets).then(
        response => {
            //console.log(JSON.stringify(response.data))
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", {message: returnMessage});
        }
    ).catch(error => {
        if (error.response) {
            EventBus.dispatch("error", { message: error.response.data.errors.title[0] });
            console.error(error.response);
        } else {
            console.error("ERROR:: ", error);
        }

    });
}

export const pageBio = (packets, pageID) => {

    return axios.post('/dashboard/page/update-bio/' + pageID,
        packets).then(
        (response) => {
            //console.log(JSON.stringify(response.data))
            const returnMessage = JSON.stringify(response.data.message);
            EventBus.dispatch("success", {message: returnMessage});
        }
    ).catch(error => {
        //console.error("ERROR:: ", error.response.data.errors.bio[0]);

        if (error.response) {
            EventBus.dispatch("error", {message: error.response.data.errors.bio[0]});
            console.error(error.response);
        } else {
            console.error("ERROR:: ", error);
        }
    });
}

export const updateProfileLayout = (packets, pageID) => {

    return axios.post('/dashboard/page/update-profile-layout/' + pageID,
        packets).then(
        (response) => {
            //console.log(JSON.stringify(response.data))
            const returnMessage = JSON.stringify(response.data.message);

            return {
                message: returnMessage
            }
        }
    ).catch(error => {
        //console.error("ERROR:: ", error.response.data.errors.bio[0]);

        if (error.response) {
            EventBus.dispatch("error", {message: "Something went wrong"});
            console.error(error.response);
        } else {
            console.error("ERROR:: ", error);
        }
    });

}

export const displayInfoBox = (e, setInfoText, setInfoTextOpen, setInfoLocation, setInfoClicked, infoClicked = null) => {

    if (infoClicked === false) {
        setInfoClicked(true);
    } else if (infoClicked === true) {
        setInfoClicked(false)
        setInfoTextOpen(false);

        return;
    }

    const name = e.target.dataset.section;
    const dataText = data.find((text) => text.section === name);
    setInfoText(dataText);
    setInfoTextOpen(true);

    const rect = e.target.getBoundingClientRect();
    const center = (rect.left + rect.right) / 2;
    const top = rect.top - 2;
    setInfoLocation({center, top});
}

export const closeInfoBox = (setInfoTextOpen, clicked, setInfoClicked = null) => {
    if(!clicked) {
        setInfoTextOpen(false)

        if(setInfoClicked) {
            setInfoClicked(false);
        }
    }
}

export const toolTipClick = (index, infoIndex, setInfoIndex, infoDiv = null) => {

    if (index === infoIndex) {
        setInfoIndex(null);
    } else if (index === 6) {
        setInfoIndex(index);
    } else {
        setInfoIndex(index);
        if (!isInViewport(infoDiv?.current)) {
            scroller.scrollTo('infoText' + index, {
                duration: 1000,
                smooth: true,
            })
        }
    }
}

const isInViewport = (infoDiv) => {

    const rect = infoDiv.getBoundingClientRect();

    return rect.top >= 0 && rect.bottom <= (window.innerHeight || document.documentElement.clientHeight);

}

export const previewButtonRequest = (setShowPreviewButton) => {

    if (window.innerWidth < 993) {
        setShowPreviewButton(true)
    } else {
        setShowPreviewButton(false)
    }
}

export default addPage;
