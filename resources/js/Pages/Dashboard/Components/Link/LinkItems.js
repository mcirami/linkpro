const userLinks = user.links;
const myLinksArray = userLinks?.map(({ id, type, name, icon, url, email, phone, embed_code, active_status, position, links }) => ({
    id,
    name,
    icon,
    url,
    email,
    phone,
    embed_code,
    active_status,
    position,
    type,
    links
}));

export default myLinksArray;
