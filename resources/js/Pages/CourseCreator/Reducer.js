export const LP_ACTIONS = {
    UPDATE_PAGE_DATA: 'update-page-data',
    UPDATE_COURSE_DATA: 'update-course-data'
}

export function reducer(data, action) {
    switch(action.type) {
        case LP_ACTIONS.UPDATE_PAGE_DATA:
            return {
                ...data,
                [`${action.payload.name}`]: action.payload.value
            }
        case LP_ACTIONS.UPDATE_COURSE_DATA:
            return {
                ...data,
                [`${action.payload.name}`]: action.payload.value
            }
    }
}
