import {useCallback, useEffect, useMemo, useState} from 'react';
import {isEmpty} from 'lodash';
import {getAffiliateStats} from '../../Services/StatsRequests';
import Table from './Table';

function App() {

    const [stats, setStats] = useState([]);
    const [totals, setTotals] = useState([]);
    const [statsDate, setStatsDate] = useState({
        startDate: null,
        endDate: null
    });

    const [isLoading, setIsLoading] = useState(true);
    const [animate, setAnimate] = useState(true);

    useEffect(() => {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const queryStartDate = urlParams.get('startDate');
        const queryEndDate = urlParams.get('endDate');
        const queryDateValue = urlParams.get('dateValue');
        const clearAll = urlParams.get('clear');

        console.log("Start Date: ",queryStartDate)
        console.log("End Date: ",queryEndDate)

        if (queryStartDate && queryEndDate ) {

            const startDate = new Date(queryStartDate * 1000)
            const endDate = new Date(queryEndDate * 1000)

            setStatsDate(() => ({
                startDate: queryStartDate,
                endDate: queryEndDate
            }));

            const packets = {
                startDate: queryStartDate,
                endDate: queryEndDate
            }

            affiliateStatsCall(packets)
        } else if (queryDateValue) {

            const packets = {
                dateValue: queryDateValue
            }
            affiliateStatsCall(packets)
        } else {

            const packets = {
                currentDay: true
            }

            affiliateStatsCall(packets)
        }

    },[]);

    const columns = useMemo(
        () => [
            {
                Header: "Affiliate",
                accessor: "name",
            },
            {
                Header: "Raw Clicks",
                accessor: "rawCount",
            },
            {
                Header: "Unique Clicks",
                accessor: "uniqueCount",
            },
            {
                Header: "Conversions",
                accessor: "conversionCount",
            },
            {
                Header: "Payout",
                accessor: "total",
            },
        ],[]
    )

    const affiliateStatsCall = useCallback((packets) => {
        setAnimate(true)

        getAffiliateStats(packets)
        .then((data) => {
            if (data["success"]) {
                setTimeout(() => {
                    setStats(data["affiliateData"])
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
        <div className="table-responsive">
            <Table
                columns={columns}
                data={stats}
                isLoading={isLoading}
                animate={animate}
                totals={totals}
            />
        </div>
    )
}

export default App
