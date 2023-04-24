import React, {useEffect, useState, useCallback, useMemo} from 'react';
import {
    getLinkStats, getOfferStats,
} from '../../../Services/StatsRequests';

import "react-datepicker/dist/react-datepicker.css";
import Filters from './Filters';
import {isEmpty} from 'lodash';
import Table from './Table';

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

    const columns = useMemo(
        () => [
            {
                Header: "Current Icons",
                accessor: "icon",
            },
            {
                Header: "Icon Name",
                accessor: "iconName",
            },
            {
                Header: "Icon Clicks",
                accessor: "visits",
            },
        ],[]
    )

    const deletedColumns = useMemo(
        () => [
            {
                Header: "Past Icons",
                accessor: "icon",
            },
            {
                Header: "Icon Name",
                accessor: "iconName",
            },
            {
                Header: "Icon Clicks",
                accessor: "visits",
            },
        ],[]
    )

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
                <Table
                    isLoading={isLoading}
                    animate={animate}
                    /*totals={totals}*/
                    data={linkStats}
                    columns={columns}
                />
            </div>
            <div className="table_wrap my_row table-responsive">
                <Table
                    isLoading={isLoading}
                    animate={animate}
                    /*totals={totals}*/
                    data={deletedStats}
                    columns={deletedColumns}
                />
            </div>
        </div>
    )
}

export default LinkStats
