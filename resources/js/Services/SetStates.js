import React from 'react';

//updates status on userLinks state
export const UpdateUserLinksStatus = (
    setUserLinks,
    userLinks,
    type,
    id,
    status
) => {

    // if link is inside a folder
    if (type === "folder") {
        setUserLinks(
            userLinks.map((item) => {
                if (item.id === id && type ===
                    "folder") {
                    return {
                        ...item,
                        active_status: status,
                    };
                }
                return item;
            })
        )
    } else {
        setUserLinks(
            userLinks.map((item) => {
                if (item.id === id && type !==
                    "folder") {
                    return {
                        ...item,
                        active_status: status,
                    };
                }
                return item;
            })
        )
    }

};

//updates status on originalArray state
export const UpdateOriginalLinksStatus = (
    setOriginalArray,
    originalArray,
    type,
    id,
    status
) => {

    // if link is inside a folder
    if(type === "folder") {
        setOriginalArray(
            originalArray.map((item) => {
                if (item.id === id && type ===
                    "folder") {
                    return {
                        ...item,
                        active_status: status,
                    };
                }
                return item;
            })
        )
    } else {
        setOriginalArray(
            originalArray.map((item) => {
                if (item.id === id && type !==
                    "folder") {
                    return {
                        ...item,
                        active_status: status,
                    };
                }
                return item;
            })
        )
    }

};

export const UpdateFolderLinkStatus = (
    id,
    status,
    setFolderLinks,
    folderLinks
) => {

    setFolderLinks(
        folderLinks.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    active_status: status,
                };
            }
            return item;
        })
    )
}


export const UpdateOrigFolderLinkStatus = (
    id,
    status,
    setOriginalFolderLinks,
    originalFolderLinks
) => {
    setOriginalFolderLinks(
        originalFolderLinks.map((item) => {
            if (item.id === id) {
                return {
                    ...item,
                    active_status: status,
                };
            }
            return item;
        })
    )
}

export const UpdateUserLinksStatusFromFolder = (
    folderID,
    currentID,
    status,
    userLinks,
    setUserLinks
) => {
    setUserLinks(
        userLinks.map((item) => {
            if (item.id === folderID && item.type === "folder") {

                const newItemLinks = item.links.map((linkItem) => {

                    if (linkItem.id === currentID) {

                        return {
                            ...linkItem,
                            active_status: status,
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
    );
}

export const UpdateOriginalLinksStatusFromFolder = (
    folderID,
    currentID,
    status,
    originalArray,
    setOriginalArray
) => {

    setOriginalArray(
        originalArray.map((item) => {
            if (item.id === folderID && item.type === "folder") {

                const newItemLinks = item.links.map((linkItem) => {

                    if (linkItem.id === currentID) {

                        return {
                            ...linkItem,
                            active_status: status,
                        }
                    }

                    return linkItem
                })

                return {
                    ...item,
                    links: newItemLinks
                }
            }
            return item;
        })
    )
}
