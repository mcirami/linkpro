import React, {useState, useEffect, useCallback, Fragment} from 'react';
import {getOfferStats} from '../../../Services/StatsRequests';
import Filters from './Filters';
import {isEmpty} from 'lodash';
import {HiOutlinePlusSm, HiMinusSm} from 'react-icons/hi';

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
    const [openIndex, setOpenIndex] = useState([]);

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
                    setOfferStats(data["creatorOfferData"])
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

    const handleRowClick = (rowIndex) => {
        console.log(openIndex);
        if(openIndex.includes(rowIndex)) {
            const newArrayIndex = openIndex.filter(element => element !== rowIndex)
            setOpenIndex(newArrayIndex)
        } else {
            const newArrayIndex = openIndex.concat(rowIndex);
            setOpenIndex(newArrayIndex);
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
                    getStats={offerStatsCall}
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
                        <>
                            {offerStats.map((item, index) => {
                                const {icon, rawClicks, uniqueClicks, conversions, payout, userStats} = item;
                                return (
                                    <React.Fragment key={index}>
                                    <tr key={index} className={userStats?.length > 0 && "no_border"}>
                                        <td>
                                            <img src={icon} alt=""/>
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
                                    {userStats?.length > 0 &&
                                        <tr>
                                            <td colSpan="5">
                                                <table className="table table-borderless user_stats">
                                                    <thead>
                                                        <tr onClick={(e) => handleRowClick(index)}>
                                                            <th scope="col">
                                                                <h5>Stats By User</h5>
                                                            </th>
                                                            <th scope="col"></th>
                                                            <th scope="col"></th>
                                                            <th scope="col"></th>
                                                            <th scope="col">{ openIndex.includes(index) ? <HiMinusSm /> : <HiOutlinePlusSm />}</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className={openIndex.includes(index) ? "open" : ""}>

                                                    {userStats.map((username, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                {Object.keys(username).map((user, i) => {

                                                                    const {rawCount, uniqueCount, conversionCount, total} = userStats[index][user];

                                                                    return (
                                                                        <React.Fragment key={i}>
                                                                            <td>
                                                                                <p className={`${animate ? "animate hide" : "animate"}`}>{user}</p>
                                                                            </td>
                                                                            <td>
                                                                                <p className={`${animate ? "animate hide" : "animate"}`}>{rawCount}</p>
                                                                            </td>
                                                                            <td>
                                                                                <p className={`${animate ? "animate hide" : "animate"}`}>{uniqueCount}</p>
                                                                            </td>
                                                                            <td>
                                                                                <p className={`${animate ? "animate hide" : "animate"}`}>{conversionCount}</p>
                                                                            </td>
                                                                            <td>
                                                                                <p className={`${animate ? "animate hide" : "animate"}`}>{"$"}{total}</p>
                                                                            </td>
                                                                        </React.Fragment>
                                                                    )
                                                                })}
                                                            </tr>
                                                        )
                                                    })}
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                    }
                                    </React.Fragment>
                                )
                            })}

                            <tr className="totals">
                                <td><h3>Totals</h3></td>
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
