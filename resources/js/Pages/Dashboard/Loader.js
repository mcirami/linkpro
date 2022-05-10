import React, {useState} from 'react';

export const Loader = ({showLoader}) => {

    return (
        showLoader &&
        <div className="loader_popup">
            <div className="loader_wrap">
                <span className="loader"> </span>
            </div>
        </div>
    )
}
