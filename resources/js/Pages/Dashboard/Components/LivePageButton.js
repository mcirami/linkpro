import React from 'react';

const LivePageButton = ({pageName}) => {

    const host = window.location.origin;

    return (
        <>
            <a className="button green w-100" target="_blank" href={host +
                '/' +
                pageName}>Open Live Page</a>
        </>
    );
};

export default LivePageButton;
