import React from 'react';

const AdvancedIcon = ({
                          colClasses,
                          displayIcon,
                          name,
                          active_status,
                          dataRow,
                          setRow,
                          value,
                          setValue,
                          mainIndex,
                          index,
                          clickType,
                          setClickType,
                          type,
                          setShowTiny
}) => {

    const handleClick = (e) => {
        e.preventDefault();

        const clickedDiv = e.currentTarget;

        if (clickedDiv.classList.contains('open')) {
            setRow(null);
            setValue(null);
        } else {
            setRow(clickedDiv.dataset.row);
            setValue(index);
            setClickType(type);
            setTimeout(function(){
                document.querySelector('.folder.open .folder_content').scrollIntoView({
                    behavior: 'smooth',
                    block: "nearest",
                });
            }, 300)
        }

    }

    return (
        <div className={ ` ${colClasses} ${mainIndex == value && clickType === type ? " open" : "" }`}
             data-row={ dataRow }
             onClick={(e) => {handleClick(e)} }
        >
            {active_status ?
                <>
                    <a className={!displayIcon ?
                        "default" : ""}
                        href="#">
                        <img src={displayIcon} alt=""/>
                    </a>
                    <p>
                        {name && name.length >
                        11 ?
                            name.substring(0,
                                11) + "..."
                            :
                            name || "Link Name"
                        }
                    </p>
                </>
                :
                ""
            }
        </div>
    );
};

export default AdvancedIcon;
