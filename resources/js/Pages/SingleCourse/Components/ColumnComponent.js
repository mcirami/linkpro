import React from 'react';

const ColumnComponent = ({
                             section,
                             dataRow,
                             setRow,
                             indexValue,
                             setIndexValue,
                             index
}) => {

    const {id, type, text, text_color, video_title, background_color} = section;

    const handleOnClick = (e) => {
        e.preventDefault();
        const clickedDiv = e.currentTarget.parentNode

        if (clickedDiv.classList.contains('open')) {
            setRow(null);
            setIndexValue(null);
        } else {
            setRow(clickedDiv.firstChild.dataset.row);
            setIndexValue(index);

            setTimeout(function(){
                document.querySelector('.my_row.folder.open').scrollIntoView({
                    behavior: 'smooth',
                    block: "nearest",
                });

            }, 300)
        }
    }

    return (

        <div className={`column ${type} ${index ==  indexValue ? "open" : "" }`} style={{ background: background_color }}>
            {type === "video" &&
                <a className="my_row" href="#" data-row={dataRow} onClick={(e) => handleOnClick(e)}>
                    <h3 style={{color: text_color}}>{video_title}</h3>
                    <span className="image_wrap my_row">
                <img src={Vapor.asset('images/image-placeholder.jpg')} alt=""/>
            </span>
                </a>

            }
            <p style={{color: text_color}}>{text}</p>
            <div className="triangle"></div>
        </div>

    );
};

export default ColumnComponent;
