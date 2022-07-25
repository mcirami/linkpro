import React, {useEffect} from 'react';
import { BiRefresh } from "react-icons/bi";
import {getPageStats, getLinkStats, getFolderStats} from '../../../Services/StatsRequests';


const RefreshButton = ({
                           startDate,
                           endDate,
                           dropdownValue,
                           tab,
                           setStatsFunc,
                           setDeletedFunc,
}) => {

    let animatedElements;

    useEffect(() => {
        animatedElements = document.querySelectorAll('p.animate');
    })

    const handleClick = (e) => {
        e.preventDefault();

        animatedElements.forEach((element) => {
            element.classList.add('hide');
        })

        let packets;

        if (dropdownValue > 0) {
            packets = {
                dateValue: dropdownValue
            }
        } else {
            packets = {
                startDate: Math.round(new Date(startDate) / 1000),
                endDate: Math.round(new Date(endDate) /1000),
            }
        }

        switch (tab) {

            case "link":

                getPageStats(packets)
                .then((data) => {
                    if (data["success"]) {
                        setTimeout(() => {
                            setStatsFunc(data["data"]);
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
                break;

            case "icon":

                getLinkStats(packets)
                .then((data) => {
                    if (data["success"]) {
                        setTimeout(() => {
                            setStatsFunc(data["currentData"]);
                            setDeletedFunc(data["pastData"]);
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
                break;

            case "folder":
                getFolderStats(packets)
                .then((data) => {

                    if (data["success"]) {
                        setTimeout(() => {
                            setStatsFunc(data["currentData"]);
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
                break;

            default:
                break;

        }

    }

    return (

        <a className="refresh_button" href="#" onClick={(e) => handleClick(e)}>
            <BiRefresh />
        </a>

    );
};

export default RefreshButton;
