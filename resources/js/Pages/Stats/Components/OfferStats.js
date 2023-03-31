import React, {useState, useEffect} from 'react';
import {getOfferStats} from '../../../Services/StatsRequests';
import Filters from './Filters';
import {isEmpty} from 'lodash';

const OfferStats = ({tab}) => {

    const [offerStats, setOfferStats] = useState([])
    /*const [linkStartDate, setLinkStartDate] = useState(null);
    const [linkEndDate, setEndDate] = useState(null);*/
    const [statsDate, setStatsDate] = useState({
        startDate: null,
        endDate: null
    });
    const [dropdownValue, setDropdownValue] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    let animatedElements;

    useEffect(() => {
        animatedElements = document.querySelectorAll('p.animate');
    })

    useEffect(() => {
        const packets = {
            currentDay: true
        }

        getOfferStats(packets)
        .then((data) => {
            if (data["success"]) {
                setTimeout(() => {
                    setOfferStats(data["currentData"])
                    setIsLoading(false);
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
            animatedElements.forEach((element) => {
                element.classList.add('hide');
            })

            setDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            getOfferStats(packets)
            .then((data) => {
                if (data["success"]) {
                    setTimeout(() => {
                        setOfferStats(data["currentData"])
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
            setStatsDate({
                startDate: null,
                endDate: null
            })
            setDropdownValue(e.target.value);

            animatedElements.forEach((element) => {
                element.classList.add('hide');
            })

            const packets = {
                dateValue: e.target.value
            }

            getOfferStats(packets).then((data) => {
                if (data["success"]) {
                    setTimeout(() => {
                        setOfferStats(data["currentData"]);
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
                        <div id="loading_spinner" className="active">
                            <img src={Vapor.asset('images/spinner.svg')} alt="" />
                        </div>
                    }
                    {isEmpty(offerStats) ?
                        <h3 className={ isLoading ? "hidden" : ""}>No Stats Available</h3>
                        :
                        offerStats.map((item, index) => {
                        const {icon, rawClicks, uniqueClicks, conversions, payout} = item;

                        return (
                            <tr key={index}>
                                <td>
                                    <img src={icon} />
                                </td>
                                <td>
                                    <p className="animate">{rawClicks}</p>
                                </td>
                                <td>
                                    <p className="animate">{uniqueClicks}</p>
                                </td>
                                <td>
                                    <p className="animate">{conversions}</p>
                                </td>
                                <td>
                                    <p className="animate">{payout}</p>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

export default OfferStats;
