const userLinks = user.links;
const myLinksArray = userLinks.map(({ id, name, icon, url, active_status, position }) => ({
    id,
    name,
    icon,
    url,
    active_status,
    position
}));

/*for (let n = 0; n < 9; n++) {
    if (!myLinksArray[n]) {
        let position;
        if (myLinksArray[n-1]) {
            position = myLinksArray[n-1].position + 1
        } else {
            position = 0;
        }
        myLinksArray[n] = {
            id: "new_" + n,
            name: "Link Name",
            icon: null,
            url: null,
            active_status: null,
            position: position
        };
    }
}*/

export default myLinksArray;
