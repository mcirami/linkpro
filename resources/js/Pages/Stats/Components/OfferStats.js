import React, {
    useState,
    useEffect,
    useCallback,
    Fragment,
    useMemo,
} from 'react';
import {getOfferStats} from '../../../Services/StatsRequests';
import Filters from './Filters';
import {isEmpty} from 'lodash';
import Table from './Table/Table';

const OfferStats = ({
                        offerStats,
                        setOfferStats,
                        totals,
                        setTotals,
                        statsDate,
                        setStatsDate,
                        dropdownValue,
                        setDropdownValue
}) => {

    const [isLoading, setIsLoading] = useState(true);
    const [animate, setAnimate] = useState(true);

    useEffect(() => {

        if (isEmpty(offerStats)) {
            const packets = {
                currentDay: true
            }

            offerStatsCall(packets)
        } else {
            setIsLoading(false);
            setAnimate(false);
        }

    },[])

    const handleDateChange = (date, type) => {

        let currentStartDate;
        let currentEndDate;

        if (type === "start") {
            setStatsDate(prevState => ({
                ...prevState,
                startDate: date
            }));
            currentStartDate = date;
            currentEndDate = statsDate.endDate ? statsDate.endDate : null;

        } else {
            setStatsDate(prevState => ({
                ...prevState,
                endDate: date
            }));
            currentEndDate = date;
            currentStartDate = statsDate.startDate ? statsDate.startDate : null;
        }

        if ( currentEndDate && currentStartDate && (currentStartDate <= currentEndDate) ) {

            setDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            offerStatsCall(packets)
        }
    }

    const handleDropdownChange = (e) => {

        if (e.target.value !== 0) {

            setStatsDate({
                startDate: null,
                endDate: null
            })
            setDropdownValue(e.target.value);

            const packets = {
                dateValue: e.target.value
            }

            offerStatsCall(packets)
        }
    }

    const offerStatsCall = useCallback((packets) => {
        setAnimate(true)

        getOfferStats(packets)
        .then((data) => {
            if (data["success"]) {
                setTimeout(() => {
                    setOfferStats(data["offerData"])
                    setTotals(data["totals"]);
                    setAnimate(false)
                    setIsLoading(false);

                }, 500)
            } else {
                setAnimate(false)
                setIsLoading(false);
            }
        });

    }, [statsDate])

    return (

        <div className="stats_wrap my_row">
            <div className="my_row filter">
                <Filters
                    handleDateChange={handleDateChange}
                    startDate={statsDate.startDate}
                    endDate={statsDate.endDate}
                    handleDropdownChange={handleDropdownChange}
                    dropdownValue={dropdownValue}
                    getStats={offerStatsCall}
                />
            </div>

            <div className="table_wrap my_row table-responsive">
                <Table
                    isLoading={isLoading}
                    animate={animate}
                    totals={totals}
                    data={offerStats}
                />
            </div>
        </div>
    )
};

export default OfferStats;
