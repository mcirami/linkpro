import React, {useCallback, useEffect, useState} from 'react';
import {getPageStats} from '../../../Services/StatsRequests';
import Filters from './Filters';
import {isEmpty} from 'lodash';

const PageStats = ({
                       pageStats,
                       setPageStats,
                       pageStatsDate,
                       setPageStatsDate,
                       pageDropdownValue,
                       setPageDropdownValue,
}) => {

    const [isLoading, setIsLoading] = useState(true);
    const [animate, setAnimate] = useState(true);

    useEffect(() => {

        if (isEmpty(pageStats)) {
            const packets = {
                currentDay: true
            }
            pageStatsCall(packets)
        } else {
            setIsLoading(false);
            setAnimate(false);
        }

    },[])

    const handleDateChange = (date, type) => {
        let currentStartDate = null;
        let currentEndDate = null;

        if (type === "start") {
            setPageStatsDate(prevState => ({
                ...prevState,
                startDate: date
            }));
            currentStartDate = date;
            currentEndDate = pageStatsDate.endDate ? pageStatsDate.endDate : null;
        } else {
            setPageStatsDate(prevState => ({
                ...prevState,
                endDate: date
            }));
            currentEndDate = date;
            currentStartDate = pageStatsDate.startDate ? pageStatsDate.startDate : null;
        }

        if (currentStartDate && currentEndDate && (currentStartDate <= currentEndDate)) {

            setPageDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            pageStatsCall(packets);
        }
    }

    const handleDropdownChange = (e) => {

        setPageStatsDate({
            startDate: null,
            endData: null
        })
        setPageDropdownValue(e.target.value);

        const packets = {
            dateValue: e.target.value
        }

        pageStatsCall(packets);
    }

    const pageStatsCall = useCallback((packets) => {
        setAnimate(true)
        getPageStats(packets)
        .then((data) => {
            if (data["success"]) {
                setTimeout(() => {
                    setPageStats(data["data"]);
                    setAnimate(false)
                    setIsLoading(false);
                }, 500)
            } else {
                setAnimate(false)
                setIsLoading(false);
            }

        });
    }, [pageStatsDate])


    return (
        <div className="stats_wrap my_row">
            <div className="my_row filter">
                <Filters
                    handleDateChange={handleDateChange}
                    startDate={pageStatsDate.startDate}
                    endDate={pageStatsDate.endDate}
                    handleDropdownChange={handleDropdownChange}
                    dropdownValue={pageDropdownValue}
                    getStats={pageStatsCall}
                />
            </div>


            <div className="table_wrap my_row table-responsive">
                <table className="table table-borderless mb-0">
                    <thead>
                        <tr>
                            <th scope="col">
                                <h5>Page Name</h5>
                            </th>
                            <th scope="col">
                                <h5>Page Loads</h5>
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
                    {isEmpty(pageStats) ?
                        <tr>
                            <td className={ isLoading ? "hidden no_stats" : "no_stats"} colSpan="5"><h3>No Stats Available</h3></td>
                        </tr>
                        :
                        pageStats.map((item) => {
                            const {id, pageName, visits, linkVisits} = item;

                            return (
                                <tr key={id}>
                                    <td>
                                        <p>{pageName}</p>
                                    </td>
                                    <td>
                                        <p className={`${animate ? "animate hide" : "animate"}`}>{visits}</p>
                                    </td>
                                    <td>
                                        <p className={`${animate ? "animate hide" : "animate"}`}>{linkVisits}</p>
                                    </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PageStats
