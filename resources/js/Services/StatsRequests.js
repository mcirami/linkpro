import axios from 'axios';

export const getPageStats = (packets) => {

    return axios.post('/stats/page/range', packets).then(
        (response) => {
            //console.log(JSON.stringify(response.data));
            const returnData = response.data;
            //EventBus.dispatch("success", { message: returnMessage });
            return {
                success : true,
                data: returnData["data"]
            }
        },

    ).catch(error => {
        if (error.response) {
            console.log(error.response);
        } else {
            console.log("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}

export const getLinkStats = (packets) => {

    return axios.post('/stats/link/range', packets).then(
        (response) => {
            //console.log(JSON.stringify(response.data));
            const returnData = response.data.data;
            //EventBus.dispatch("success", { message: returnMessage });

            return {
                success : true,
                currentData: returnData["currentData"],
                pastData: returnData["pastData"]
            }
        },

    ).catch(error => {
        if (error.response) {
            console.log(error.response);
        } else {
            console.log("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}

export const getFolderStats = (packets) => {

    return axios.post('/stats/folder/range', packets).then(
        (response) => {
            //console.log(JSON.stringify(response.data));
            const returnData = response.data.data;
            //EventBus.dispatch("success", { message: returnMessage });

            return {
                success : true,
                currentData: returnData["currentData"],
                /*pastData: returnData["pastData"]*/
            }
        },

    ).catch(error => {
        if (error.response) {
            console.log(error.response);
        } else {
            console.log("ERROR:: ", error);
        }

        return {
            success : false
        }
    });
}

export default getPageStats;
