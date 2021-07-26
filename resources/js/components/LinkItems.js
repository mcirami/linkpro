import React from 'react';

const userLinks = user.links;
const stringIndex = user.defaultIcon[0].search("/images");
//const end = defaultIconPath[0].search("/images");
const defaultIconPath = user.defaultIcon[0].slice(stringIndex);

let myLinksArray = [];
for (let n = 0; n < 9 ; n++) {

    if (userLinks[n] !== undefined) {
        myLinksArray.push({
            id: userLinks[n].id,
            name: userLinks[n].name,
            url: userLinks[n].url,
            icon: userLinks[n].icon,
            position: userLinks[n].position,
            active_status: userLinks[n].active_status
        })
    } else {
        const id = "new_" + (n + 1);
        //const name = "add_new_link_" + n;

        myLinksArray.push({
            id: id,
            name: "Link Name",
            url: "https://linkurl.com",
            icon: defaultIconPath,
            position: 0,
            active_status: false
        })
    }
}

export default myLinksArray;
