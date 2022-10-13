import React from 'react';
import parse from 'html-react-parser';

const EmbedCode = ({dataRow, row, embedCode}) => {

    return (
        <>
            {embedCode !== undefined ?
                <div className={`my_row form ${dataRow == row ?
                    "open" :
                    ""}`}>
                    {dataRow == row ? parse(`${embedCode}`) : ""}
                </div>

                :
                ""
            }
        </>
    );
};

export default EmbedCode;
