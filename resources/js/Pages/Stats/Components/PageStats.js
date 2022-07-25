import React, {useEffect} from 'react';
import {getPageStats} from '../../../Services/StatsRequests';
import Filters from './Filters';

const PageStats = ({
                       pageStats,
                       setPageStats,
                       pageStartDate,
                       setPageStartDate,
                       pageEndDate,
                       setPageEndDate,
                       pageDropdownValue,
                       setPageDropdownValue,
                       tab
}) => {

    let animatedElements;

    useEffect(() => {
        animatedElements = document.querySelectorAll('p.animate');
    })

    const handleDateChange = (date, type) => {
        let currentStartDate = null;
        let currentEndDate = null;

        if (type === "start") {
            setPageStartDate(date);
            currentStartDate = date;
            if (pageEndDate) {
                currentEndDate = pageEndDate;
            }
        } else {
            setPageEndDate(date);
            currentEndDate = date;
            if (pageStartDate) {
                currentStartDate = pageStartDate;
            }
        }

        if (currentStartDate && currentEndDate && (currentStartDate <= currentEndDate)) {
            animatedElements.forEach((element) => {
                element.classList.add('hide');
            })
            setPageDropdownValue(0);
            const packets = {
                startDate: Math.round(new Date(currentStartDate) / 1000),
                endDate: Math.round(new Date(currentEndDate) /1000),
            }

            getPageStats(packets)
            .then((data) => {
                if (data["success"]) {
                    setTimeout(() => {
                        setPageStats(data["data"]);
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

        setPageStartDate(null);
        setPageEndDate(null);
        setPageDropdownValue(e.target.value);

        console.log(animatedElements);

        animatedElements.forEach((element) => {
            element.classList.add('hide');
        })


        const packets = {
            dateValue: e.target.value
        }

        getPageStats(packets)
        .then((data) => {
            if (data["success"]) {
                setTimeout(() => {
                    setPageStats(data["data"]);
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

    return (
        <div className="stats_wrap my_row">
            <div className="my_row filter">
                <Filters handleDateChange={handleDateChange}
                         startDate={pageStartDate}
                         endDate={pageEndDate}
                         handleDropdownChange={handleDropdownChange}
                         dropdownValue={pageDropdownValue}
                         tab={tab}
                         setStatsFunc={setPageStats}
                />
            </div>

            {pageStats && pageStats.length > 0 ?
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

                                {pageStats.map((item) => {
                                    const {id, pageName, visits, linkVisits} = item;

                                    return (

                                        <tr key={id}>
                                            <td>
                                                <p>{pageName}</p>
                                            </td>
                                            <td>
                                                <p className="animate">{visits}</p>
                                            </td>
                                            <td>
                                                <p className="animate">{linkVisits}</p>
                                            </td>
                                        </tr>
                                    )
                                })}

                            </tbody>

                    </table>
                </div>
                :
                <h3>No Stats Available</h3>
            }
        </div>
    )
}

export default PageStats
