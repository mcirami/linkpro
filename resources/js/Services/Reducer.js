import myLinksArray from '../Pages/Dashboard/components/Link/LinkItems';

export const LINKS_ACTIONS = {
    UPDATE_STATUS: 'update-status',
}

export function reducer(userLinks, action) {
    switch (action.type) {
        case LINKS_ACTIONS.UPDATE_STATUS:
            return userLinks.map(userLink => {
                if (userLink.id === action.payload.id) {

                    return {
                        ...userLink,
                        active_status: !userLink.active_status,
                    };

                }
                return userLink;
            })
        default:
            return myLinksArray;
    }
}
