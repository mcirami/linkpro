import React, {useContext} from 'react';
import {getAllLinks, updateLinksPositions} from './linksRequest';
import {LINKS_ACTIONS, ORIGINAL_LINKS_ACTIONS} from './reducer';
import {OriginalArrayContext, UserLinksContext} from '../Pages/Dashboard/App';

const myErrorHandler = (Error, {componentStack: string}) => {

    const {userLinks, dispatch} = useContext(UserLinksContext);
    const { dispatchOrig } = useContext(OriginalArrayContext);

    if (String(Error).includes("Invalid attempt to destructure non-iterable instance")) {
        const packets = {
            userLinks: userLinks,
        }
        updateLinksPositions(packets)
        .then(() => {

            getAllLinks(pageSettings["id"])
            .then((data) => {
                if (data["success"]) {
                    dispatch({ type: LINKS_ACTIONS.SET_LINKS, payload: { links: data["userLinks"]} })
                    dispatchOrig({ type: ORIGINAL_LINKS_ACTIONS.SET_ORIGINAL_LINKS, payload: {links: data["userLinks"]} })
                }
            })
        });
    }
}

export default myErrorHandler;
