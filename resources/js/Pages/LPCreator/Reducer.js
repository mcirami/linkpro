export const LP_ACTIONS = {
    UPDATE_IMAGE: 'update-logo',
    UPDATE_TEXT: 'update-text',
    UPDATE_COLOR: 'update-color',
    UPDATE_PAGE_DATA: 'update-page-data'
}

export function reducer(pageData, action) {
    switch(action.type) {
        case LP_ACTIONS.UPDATE_PAGE_DATA:
            return {
                ...pageData,
                [`${action.payload.name}`]: action.payload.value
            };
        case LP_ACTIONS.UPDATE_TEXT:
            return {
                ...pageData,
                [`${action.payload.name}`]: action.payload.value
            }
        case LP_ACTIONS.UPDATE_COLOR:
            return {
                ...pageData,
                [`${action.payload.name}`]: action.payload.value
            }
    }
}
