import React, {useEffect} from 'react';
import {
    getLinkStats,
} from '../../../Services/StatsRequests';

import "react-datepicker/dist/react-datepicker.css";
import Filters from './Filters';

const LinkStats = ({
                       linkStats,
                       setLinkStats,
                       deletedStats,
                       setDeletedStats,
                       linkEndDate,
                       setLinkEndDate,
                       linkStartDate,
                       setLinkStartDate,
                       linkDropdownValue,
                       setLinkDropdownValue
}) => {

    let animatedElements;

    useEffect(() => {
        animatedElements = document.querySelectorAll('p.animate');
    })

    const handleDateChange = (date, type) => {

        let currentStartDate = null;
        let currentEndDate =  null;

        if (type === "start") {
            setLinkStartDate(date);
            currentStartDate = date;
            if (linkEndDate) {
                currentEndDate = linkEndDate;
            }
        } else {
            setLinkEndDate(date);
            currentEndDate = date;
            if (linkStartDate) {
                currentStartDate = linkStartDate;
            }
        }

        if ( currentEndDate && currentStartDate && (currentStartDate <= currentEndDate) ) {
            animatedElements.forEach((element) => {
                element.classList.add('hide');
            })

            setLinkDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            getLinkStats(packets)
            .then((data) => {
                if (data["success"]) {
                    setTimeout(() => {
                        setLinkStats(data["currentData"]);
                        setDeletedStats(data["pastData"]);
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

        if (e.target.value !== 0) {
            setLinkStartDate(null);
            setLinkEndDate(null);
            setLinkDropdownValue(e.target.value);

            animatedElements.forEach((element) => {
                element.classList.add('hide');
            })

            const packets = {
                dateValue: e.target.value
            }

            getLinkStats(packets).then((data) => {
                if (data["success"]) {
                    setTimeout(() => {
                        setLinkStats(data["currentData"]);
                        setDeletedStats(data["pastData"]);
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
    }

    return (
        <div className="stats_wrap my_row">
            <div className="my_row filter">
                <Filters handleDateChange={handleDateChange}
                         startDate={linkStartDate}
                         endDate={linkEndDate}
                         handleDropdownChange={handleDropdownChange}
                         dropdownValue={linkDropdownValue}/>
            </div>
            {linkStats && linkStats.length > 0 ?
            <div className="table_wrap my_row table-responsive">
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

                    {linkStats.map((item, index) => {
                            const {iconName, icon, visits} = item;

                            return (
                                <tr key={index}>
                                    <td>
                                        <img src={icon} />
                                    </td>
                                    <td>
                                        <p>{iconName}</p>
                                    </td>
                                    <td>
                                        <p className="animate">{visits}</p>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
                :
                <h3>No Icon Stats Available</h3>
            }
            {deletedStats && deletedStats.length > 0 ?
                <div className="table_wrap my_row table-responsive">
                    <table className="table table-borderless mb-0">
                        <thead>
                        <tr>
                            <th scope="col">
                                <h5>Past Icons</h5>
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

                        {deletedStats.map((item) => {
                            const {id, iconName, icon, visits} = item;

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
                        })}
                        </tbody>
                    </table>
                </div>
                :
                <h3>No Deleted Icon Stats Available</h3>
            }
        </div>
    )
}

export default LinkStats
