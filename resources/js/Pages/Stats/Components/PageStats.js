import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {getPageStats} from '../../../Services/StatsRequests';
import Filters from './Filters';
import {isEmpty} from 'lodash';
import Table from './Table';

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

    const columns = useMemo(
        () => [
            {
                Header: "Page Name",
                accessor: "pageName",
            },
            {
                Header: "Page Loads",
                accessor: "visits",
            },
            {
                Header: "Icon Clicks",
                accessor: "linkVisits",
            },
        ],[]
    )

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
                <Table
                    isLoading={isLoading}
                    animate={animate}
                    /*totals={totals}*/
                    data={pageStats}
                    columns={columns}
                />
            </div>
        </div>
    )
}

export default PageStats
