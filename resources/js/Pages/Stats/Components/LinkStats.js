import React, {useEffect, useState, useCallback} from 'react';
import {
    getLinkStats, getOfferStats,
} from '../../../Services/StatsRequests';

import "react-datepicker/dist/react-datepicker.css";
import Filters from './Filters';
import {isEmpty} from 'lodash';

const LinkStats = ({
                       linkStats,
                       setLinkStats,
                       deletedStats,
                       setDeletedStats,
                       linkStatsDate,
                       setLinkStatsDate,
                       linkDropdownValue,
                       setLinkDropdownValue,
}) => {

    const [isLoading, setIsLoading] = useState(true);
    const [animate, setAnimate] = useState(true);

    useEffect(() => {

        if (isEmpty(linkStats)) {
            const packets = {
                currentDay: true
            }
            linkStatsCall(packets)
        } else {
            setIsLoading(false);
            setAnimate(false);
        }

    },[])

    const handleDateChange = (date, type) => {

        let currentStartDate = null;
        let currentEndDate =  null;

        if (type === "start") {
            setLinkStatsDate(prevState => ({
                ...prevState,
                startDate: date
            }));
            currentStartDate = date;
            currentEndDate = linkStatsDate.endDate ? linkStatsDate.endDate : null;
        } else {
            setLinkStatsDate(prevState => ({
                ...prevState,
                endDate: date
            }));
            currentEndDate = date;
            currentStartDate = linkStatsDate.startDate ? linkStatsDate.startDate : null;
        }

        if ( currentEndDate && currentStartDate && (currentStartDate <= currentEndDate) ) {

            setLinkDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            linkStatsCall(packets)
        }
    }

    const handleDropdownChange = (e) => {

        if (e.target.value !== 0) {

            setLinkStatsDate({
                startDate: null,
                endData: null
            });
            setLinkDropdownValue(e.target.value);

            const packets = {
                dateValue: e.target.value
            }

            linkStatsCall(packets)
        }
    }

    const linkStatsCall = useCallback((packets) => {

        setAnimate(true)
        getLinkStats(packets)
        .then((data) => {
            if (data["success"]) {
                setTimeout(() => {
                    setLinkStats(data["linkStats"])
                    setDeletedStats(data["deletedStats"]);
                    setAnimate(false)
                    setIsLoading(false);

                }, 500)
            } else {
                setAnimate(false)
                setIsLoading(false);
            }
        });

    }, [linkStatsDate])

    return (
        <div className="stats_wrap my_row">
            <div className="my_row filter">
                <Filters
                    handleDateChange={handleDateChange}
                    startDate={linkStatsDate.startDate}
                    endDate={linkStatsDate.endDate}
                    handleDropdownChange={handleDropdownChange}
                    dropdownValue={linkDropdownValue}
                    getStats={linkStatsCall}
                />
            </div>
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
                    {isLoading &&
                        <tr id="loading_spinner" className="active">
                            <td colSpan="5" >
                                <img src={Vapor.asset('images/spinner.svg')} alt="" />
                            </td>
                        </tr>
                    }
                    {isEmpty(linkStats) ?
                        <tr>
                            <td className={ isLoading ? "hidden no_stats" : "no_stats"} colSpan="5"><h3>No Stats Available</h3></td>
                        </tr>
                        :
                        linkStats.map((item, index) => {
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
                                        <p className={`${animate ? "animate hide" : "animate"}`}>{visits}</p>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
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
                    {isLoading &&
                        <tr id="loading_spinner" className="active">
                            <td colSpan="5" >
                                <img src={Vapor.asset('images/spinner.svg')} alt="" />
                            </td>
                        </tr>
                    }
                    {isEmpty(deletedStats) ?
                        <tr>
                            <td className={ isLoading ? "hidden no_stats" : "no_stats"} colSpan="5"><h3>No Stats Available</h3></td>
                        </tr>
                        :
                        !isEmpty(deletedStats) &&
                        <>
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
                        </>
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default LinkStats
