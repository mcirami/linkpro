export const LP_ACTIONS = {
    UPDATE_LOGO: 'update-logo',
    UPDATE_TEXT: 'update-text',
    UPDATE_HERO: 'update-hero',
    UPDATE_HEADER_COLOR: 'update-header-color',
    UPDATE_BUTTON_COLOR: 'update-button-color',
    UPDATE_BUTTON_TEXT_COLOR: 'update-button-text-color',
    UPDATE_BUTTON_TEXT: 'update-button-text',
}

export function reducer(pageData, action) {
    switch(action.type) {
        case LP_ACTIONS.UPDATE_LOGO:
            return {
                ...pageData,
                logo: action.payload.imagePath
            };
        case LP_ACTIONS.UPDATE_TEXT:
            return {
                ...pageData,
                [`${action.payload.name}`]: action.payload.value
            }
    }
}
