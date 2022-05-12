import React, {useEffect} from 'react';
import {
    getFolderStats,
} from '../../../Services/StatsRequests';

import "react-datepicker/dist/react-datepicker.css";
import Filters from './Filters';

const FolderStats = ({
                         folderStats,
                         setFolderStats,
                         folderStartDate,
                         setFolderStartDate,
                         folderEndDate,
                         setFolderEndDate,
                         folderDropdownValue,
                         setFolderDropdownValue

                   }) => {

    let animatedElements;

    useEffect(() => {
        animatedElements = document.querySelectorAll('p.animate');
    })

    const handleDateChange = (date, type) => {

        let currentStartDate = null;
        let currentEndDate =  null;

        if (type === "start") {
            setFolderStartDate(date);
            currentStartDate = date;
            if (folderEndDate) {
                currentEndDate = folderEndDate;
            }
        } else {
            setFolderEndDate(date);
            currentEndDate = date;
            if (folderStartDate) {
                currentStartDate = folderStartDate;
            }
        }

        if ( currentEndDate && currentStartDate && (currentStartDate <= currentEndDate) ) {
            animatedElements.forEach((element) => {
                element.classList.add('hide');
            })

            setFolderDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            getFolderStats(packets)
            .then((data) => {

                if (data["success"]) {
                    setTimeout(() => {
                        setFolderStats(data["currentData"]);
                        //setDeletedStats(data["pastData"]);
                        animatedElements.forEach((element) => {
                            element.classList.remove('hide');
                        })

                    }, 500)
                } else {
                    animatedElements.forEach((element) => {
                        element.classList.remove('hide');
                    })
                }
            });
        }
    }

    const handleDropdownChange = (e) => {

        setFolderStartDate(null);
        setFolderEndDate(null);
        setFolderDropdownValue(e.target.value);

        animatedElements.forEach((element) => {
            element.classList.add('hide');
        })

        const packets = {
            dateValue: e.target.value
        }

        getFolderStats(packets)
        .then((data) => {

            if (data["success"]) {
                setTimeout(() => {
                    setFolderStats(data["currentData"]);
                    //setDeletedStats(data["deletedStats"]);
                    animatedElements.forEach((element) => {
                        element.classList.remove('hide');
                    })

                }, 500)
            } else {
                animatedElements.forEach((element) => {
                    element.classList.remove('hide');
                })
            }
        })
    }

    return (
        <div className="stats_wrap my_row">
            {folderStats ?
                <>
                <div className="my_row filter">
                    <Filters handleDateChange={handleDateChange}
                             startDate={folderStartDate}
                             endDate={folderEndDate}
                             handleDropdownChange={handleDropdownChange}
                             dropdownValue={folderDropdownValue}/>
                </div>

                {folderStats.map((item) => {

                    const {
                        id,
                        name,
                        clickCount,
                        links } = item;

                    return (
                        <div className="my_row" key={id}>
                            <div className="my_row labels">
                                <h5>Folder Name</h5>
                                <h5>Folder Clicks</h5>
                            </div>
                            <div className="content_wrap">
                                <div className="my_row title">
                                    <p> {name} </p>
                                    <p className="animate">{clickCount}</p>
                                </div>
                                {links && links.length > 0 ?
                                    <div className="table_wrap my_row table-responsive mb-4">
                                        <table className="table table-borderless">
                                            <thead>
                                            <tr>
                                                <th scope="col">
                                                    <h5>Current Icons</h5>
                                                </th>
                                                <th scope="col">
                                                    <h5>Icon Name</h5>
                                                </th>
                                                <th scope="col">
                                                    <h5>Icon Clicks</h5>
                                                </th>
                                            </tr>
                                            </thead>
                                                <tbody>
                                                    {links.map((link) => {

                                                        const {
                                                            id,
                                                            iconName,
                                                            icon,
                                                            visits
                                                        } = link;

                                                        return (

                                                            <tr key={id}>
                                                                <td>
                                                                    <img src={icon}/>
                                                                </td>
                                                                <td>
                                                                    <p>{iconName}</p>
                                                                </td>
                                                                <td>
                                                                    <p className="animate">{visits}</p>
                                                                </td>
                                                            </tr>

                                                        )
                                                    })
                                                }

                                            </tbody>
                                        </table>
                                    </div>
                                    :
                                    <h3>No Stats Available</h3>
                                }
                            </div>
                        </div>
                    )
                })
            }
            </>
                :
                <h3>No Stats Available</h3>
            }
        </div>
    )
}

export default FolderStats
