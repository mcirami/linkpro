import React, {useState, useEffect} from 'react';
import {getOfferStats} from '../../../Services/StatsRequests';
import Filters from './Filters';
import {isEmpty} from 'lodash';

const OfferStats = ({tab}) => {

    const [offerStats, setOfferStats] = useState([]);
    const [totals, setTotals] = useState([]);

    const [statsDate, setStatsDate] = useState({
        startDate: null,
        endDate: null
    });
    const [dropdownValue, setDropdownValue] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        const packets = {
            currentDay: true
        }

        getOfferStats(packets)
        .then((data) => {
            if (data["success"]) {
                setTimeout(() => {
                    setOfferStats(data["creatorOfferData"])
                    setTotals(data["totals"]);
                    setAnimate(false)

                }, 500)
            } else {
                setAnimate(false)
            }

            setIsLoading(false);
        });
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
            setAnimate(true);
            setDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            getOfferStats(packets)
            .then((data) => {
                if (data["success"]) {
                    setTimeout(() => {
                        setOfferStats(data["creatorOfferData"]);
                        setTotals(data["totals"]);
                        setAnimate(false);

                    }, 500)
                } else {
                    setAnimate(false);
                }

            });
        }
    }

    const handleDropdownChange = (e) => {

        if (e.target.value !== 0) {

            setAnimate(true);
            setStatsDate({
                startDate: null,
                endDate: null
            })
            setDropdownValue(e.target.value);

            const packets = {
                dateValue: e.target.value
            }

            getOfferStats(packets).then((data) => {
                if (data["success"]) {
                    setTimeout(() => {
                        setOfferStats(data["creatorOfferData"]);
                        setTotals(data["totals"]);
                        setAnimate(false);
                    }, 500)
                } else {
                    setAnimate(false);
                }
            })
        }
    }

    return (

        <div className="stats_wrap my_row">
            <div className="my_row filter">
                <Filters
                    handleDateChange={handleDateChange}
                    startDate={statsDate.startDate}
                    endDate={statsDate.endDate}
                    handleDropdownChange={handleDropdownChange}
                    dropdownValue={dropdownValue}
                    tab={tab}
                    setStatsFunc={setOfferStats}
                />
            </div>


            <div className="table_wrap my_row table-responsive">
                <table className="table table-borderless">
                    <thead>
                    <tr>
                        {/*<th scope="col" rowSpan={offerStats.length}>
                        </th>*/}
                        <th scope="col">
                            <h5>Offer</h5>
                        </th>
                        <th scope="col">
                            <h5>Raw Clicks</h5>
                        </th>
                        <th scope="col">
                            <h5>Unique Clicks</h5>
                        </th>
                        <th scope="col">
                            <h5>Conversions</h5>
                        </th>
                        <th scope="col">
                            <h5>Payout</h5>
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
                    {isEmpty(offerStats) ?
                        <tr>
                            <td className={ isLoading ? "hidden no_stats" : "no_stats"} colSpan="5"><h3>No Stats Available</h3></td>
                        </tr>
                        :
                        !isEmpty(offerStats) &&
                        <>
                            {/*<tr>
                                <td rowSpan="0"><h3>Your Offers</h3></td>
                            </tr>*/}
                            {offerStats.map((item, index) => {
                                const {icon, rawClicks, uniqueClicks, conversions, payout} = item;
                                return (
                                    <tr key={index}>
                                        <td>
                                            <img src={icon} />
                                        </td>
                                        <td>
                                            <p className={`${animate ? "animate hide" : "animate"}`}>{rawClicks}</p>
                                        </td>
                                        <td>
                                            <p className={`${animate ? "animate hide" : "animate"}`}>{uniqueClicks}</p>
                                        </td>
                                        <td>
                                            <p className={`${animate ? "animate hide" : "animate"}`}>{conversions}</p>
                                        </td>
                                        <td>
                                            <p className={`${animate ? "animate hide" : "animate"}`}>{"$"}{payout}</p>
                                        </td>
                                    </tr>
                                )
                            })}

                            <tr className="totals">
                                <td><h3>Total</h3></td>
                                <td><h3 className={`${animate ? "animate hide" : "animate"}`}>{totals["totalRaw"]}</h3></td>
                                <td><h3 className={`${animate ? "animate hide" : "animate"}`}>{totals["totalUnique"]}</h3></td>
                                <td><h3 className={`${animate ? "animate hide" : "animate"}`}>{totals["totalConversions"]}</h3></td>
                                <td><h3 className={`${animate ? "animate hide" : "animate"}`}>${totals["totalPayout"]}</h3></td>
                            </tr>
                        </>
                    }
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default OfferStats;
