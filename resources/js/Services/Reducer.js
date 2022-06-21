import myLinksArray from '../Pages/Dashboard/components/Link/LinkItems';

export const LINKS_ACTIONS = {
    SET_LINKS: 'set-links',
    SET_FOLDER_LINKS_ORDER: 'set-folder-links-order',
    UPDATE_LINKS_STATUS: 'update-links-status',
    UPDATE_LINKS_STATUS_FROM_FOLDER: 'update-links-status-from-folder'
}

export function reducer(userLinks, action) {

    switch (action.type) {

        case LINKS_ACTIONS.SET_LINKS:

            return action.payload.links

        case LINKS_ACTIONS.SET_FOLDER_LINKS_ORDER:

            return userLinks.map((item) => {
                if (item.id === action.payload.id && item.type === "folder") {

                    return {
                        ...item,
                        links: action.payload.links
                    }
                }

                return item
            });

        case LINKS_ACTIONS.UPDATE_LINKS_STATUS:

            return userLinks.map(item => {

                if (item.id === action.payload.id) {

                    return {
                        ...item,
                        active_status: !item.active_status,
                    }

                }
                return item;
            })

        case LINKS_ACTIONS.UPDATE_LINKS_STATUS_FROM_FOLDER:

            return userLinks.map((item) => {

                if (item.id === action.payload.folderID && item.type === "folder") {

                    const newItemLinks = item.links.map((linkItem) => {

                        if (linkItem.id === action.payload.id) {

                            return {
                                ...linkItem,
                                active_status: !linkItem.active_status,
                            }
                        }

                        return linkItem;
                    })

                    return {
                        ...item,
                        links: newItemLinks
                    }
                }
                return item;
            })
        default:
            return myLinksArray;
    }
}

export const ORIGINAL_LINKS_ACTIONS = {
    SET_ORIGINAL_LINKS: 'set-original-links',
    SET_FOLDER_LINKS_ORDER: 'set-folder-links-order',
    UPDATE_ORIGINAL_LINKS_STATUS: 'update-original-links-status',
    UPDATE_ORIGINAL_LINKS_STATUS_FROM_FOLDER: 'update-original-links-status_from_folder',
}

export function origLinksReducer(originalArray, action) {

    switch (action.type) {

        case ORIGINAL_LINKS_ACTIONS.SET_ORIGINAL_LINKS:

            return action.payload.links

        case ORIGINAL_LINKS_ACTIONS.SET_FOLDER_LINKS_ORDER:

            return originalArray.map((item) => {
                if (item.id === action.payload.id && item.type === "folder") {

                    return {
                        ...item,
                        links: action.payload.links
                    }
                }

                return item
            });

        case ORIGINAL_LINKS_ACTIONS.UPDATE_ORIGINAL_LINKS_STATUS:

            return originalArray.map(item => {

                if (item.id === action.payload.id) {

                    return {
                        ...item,
                        active_status: !item.active_status,
                    }

                }
                return item;
            })

        case ORIGINAL_LINKS_ACTIONS.UPDATE_ORIGINAL_LINKS_STATUS_FROM_FOLDER:

            return originalArray.map((item) => {

                if (item.id === action.payload.folderID && item.type === "folder") {

                    const newItemLinks = item.links.map((linkItem) => {

                        if (linkItem.id === action.payload.id) {

                            return {
                                ...linkItem,
                                active_status: !linkItem.active_status,
                            }
                        }

                        return linkItem;
                    })

                    return {
                        ...item,
                        links: newItemLinks
                    }
                }
                return item;
            })

        default:

            return myLinksArray;
    }
}

export const FOLDER_LINKS_ACTIONS = {
    SET_FOLDER_LINKS: 'set-folder-links',
    UPDATE_FOLDER_LINKS_STATUS: 'update-folder-links-status'
}

export function folderLinksReducer(folderLinks, action) {

    switch (action.type) {

        case FOLDER_LINKS_ACTIONS.SET_FOLDER_LINKS:

            return action.payload.links

        case FOLDER_LINKS_ACTIONS.UPDATE_FOLDER_LINKS_STATUS:

            return folderLinks.map(item => {

                if (item.id === action.payload.id) {

                    return {
                        ...item,
                        active_status: !item.active_status,
                    }

                }
                return item;
            })

        default:

            return folderLinks;
    }
}

export const ORIG_FOLDER_LINKS_ACTIONS = {
    SET_ORIG_FOLDER_LINKS: 'set-orig-folder-links',
    UPDATE_ORIG_FOLDER_LINKS_STATUS: 'update-orig-folder-links-status'
}

export function origFolderLinksReducer(origFolderLinks, action) {

    switch (action.type) {

        case ORIG_FOLDER_LINKS_ACTIONS.SET_ORIG_FOLDER_LINKS:

            return action.payload.links

        case ORIG_FOLDER_LINKS_ACTIONS.UPDATE_ORIG_FOLDER_LINKS_STATUS:

            return origFolderLinks.map(item => {

                if (item.id === action.payload.id) {

                    return {
                        ...item,
                        active_status: !item.active_status,
                    }

                }
                return item;
            })

        default:

            return origFolderLinks;
    }
}
