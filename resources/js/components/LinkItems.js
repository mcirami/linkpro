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
            link: userLinks[n].link,
            link_icon: userLinks[n].link_icon,
        })
    } else {
        const id = "new_" + (n + 1);
        const name = "add_new_link_" + n;

        myLinksArray.push({
            id: id,
            name: name,
            link: null,
            link_icon: defaultIconPath,
        })
    }
}

export default myLinksArray;
