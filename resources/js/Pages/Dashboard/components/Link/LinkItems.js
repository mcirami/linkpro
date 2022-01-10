const userLinks = user.links;
const myLinksArray = userLinks.map(({ id, name, icon, url, email, phone, active_status, position }) => ({
    id,
    name,
    icon,
    url,
    email,
    phone,
    active_status,
    position
}));

export default myLinksArray;
