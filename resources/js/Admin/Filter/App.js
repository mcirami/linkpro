import React, {useEffect, useState} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {postDate, clearFilters} from '../Services/Admin';

function App() {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [pathName, setPathName] = useState(window.location.pathname);
    const [dropdownValue, setDropdownValue] = useState("custom");

    useEffect(() => {

        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const queryStartDate = urlParams.get('startDate');
        const queryEndDate = urlParams.get('endDate');
        const queryDateValue = urlParams.get('dateValue');
        const clearAll = urlParams.get('clear');

        if (queryStartDate && queryEndDate ) {

            const startDate = new Date(queryStartDate * 1000)
            const endDate = new Date(queryEndDate * 1000)

            setStartDate(startDate);
            setEndDate(endDate);

            setDropdownValue("custom");
        } else if (queryDateValue) {
            setDropdownValue(queryDateValue);
        } else if (clearAll) {
            setDropdownValue("custom");
        }

    },[]);

    const handleDateChange = (date, type) => {

        let currentStartDate = null;
        let currentEndDate =  null;

        if (type === "start") {
            setStartDate(date);
            currentStartDate = date;
            if (endDate) {
                currentEndDate = endDate;
            }
        } else {
            setEndDate(date);
            currentEndDate = date;
            if (startDate) {
                currentStartDate = startDate;
            }
        }

        if ( currentEndDate && currentStartDate && (currentStartDate <= currentEndDate) ) {

            setDropdownValue("custom");
            const startDate = Math.round(new Date(currentStartDate) / 1000);
            const endDate = Math.round(new Date(currentEndDate) /1000);

            const url = pathName + '?startDate=' + startDate + "&endDate=" + endDate

            postDate(url);
        }
    }

    const handleDropdownChange = (e) => {
            setStartDate(null);
            setEndDate(null);
            setDropdownValue(e.target.value);
        if (e.target.value !== "custom") {

            const url = pathName + "?dateValue=" + e.target.value;
            postDate(url);
        }
    }

    const handleOnClick = (e) => {
        e.preventDefault();

        const url = pathName + "?clear=all";
        clearFilters(url);
    }

    return (
        <div className="my_row">
            <h5>Filter by Date</h5>
            <div className="column_wrap">
                <div className="column">
                    <select onChange={(e) => handleDropdownChange(e)} value={dropdownValue}>
                        <option value="1">Today</option>
                        <option value="2">Yesterday</option>
                        <option value="3">Week To date</option>
                        <option value="4">Month To Date</option>
                        <option value="5">Year To Date</option>
                        <option value="6">Last Week</option>
                        <option value="7">Last Month</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div className="column">
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => handleDateChange(date, "start") }
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        maxDate={new Date()}
                        placeholderText='Start Date'
                    />
                </div>
                <div className="column">
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => handleDateChange(date, "end")}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        maxDate={new Date()}
                        placeholderText='End Date'
                    />
                </div>
                <div className="column">
                    <a className="button blue"
                       onClick={(e) => handleOnClick(e)}
                       href="#">Clear Filters</a>
                </div>
            </div>
        </div>
    )
}

export default App;
