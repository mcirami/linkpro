import React from 'react';

const SubForm = ({
                     colClasses,
                     displayIcon,
                     name,
                     active_status,
                     dataRow,
                     setRow,
                     value,
                     setValue,
                     mainIndex,
                     index
}) => {

    const handleClick = (e) => {
        e.preventDefault();

        const clickedDiv = e.currentTarget;

        if (clickedDiv.classList.contains('open')) {
            setRow(null);
            setValue(null);
            //clickedDiv.classList.remove('open');
        } else {
            setRow(clickedDiv.dataset.row);
            setValue(index);
            //clickedDiv.classList.add('open');
            /*setTimeout(function(){
                document.querySelector('.icons_wrap.inner .icon_col:first-child').scrollIntoView({
                    behavior: 'smooth',
                    block: "nearest",
                });

            }, 300)*/
        }
    }

    return (
        <div className={ ` ${colClasses} ${mainIndex == value ? " open" : "" }`} data-row={ dataRow } onClick={(e) => {handleClick(e)} }>
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

export default SubForm;
