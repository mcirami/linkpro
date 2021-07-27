const userLinks = user.links;

const myLinksArray = userLinks.map(({ id, name, icon, url }) => ({
    id,
    name,
    icon,
    url,
}));

for (let n = 0; n < 9; n++) {
    if (!myLinksArray[n]) {
        myLinksArray[n] = {};
    }
}

export default myLinksArray;
