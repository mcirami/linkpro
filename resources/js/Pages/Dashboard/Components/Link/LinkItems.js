const userLinks = user.links;
const myLinksArray = userLinks?.map(({
                                         id,
                                         type,
                                         name,
                                         icon,
                                         url,
                                         email,
                                         phone,
                                         mailchimp_list_id,
                                         shopify_products,
                                         shopify_id,
                                         active_status,
                                         position,
                                         description,
                                         links
}) => ({
    id,
    name,
    icon,
    url,
    email,
    phone,
    mailchimp_list_id,
    shopify_products,
    shopify_id,
    active_status,
    position,
    type,
    description,
    links
}));

export default myLinksArray;
