import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export const Filters = ({handleDateChange, startDate, endDate, handleDropdownChange, dropdownValue}) => {

    return (
        <>
            <div className="column">
                <select onChange={(e) => handleDropdownChange(e)} value={dropdownValue}>
                    <option value="1">Today</option>
                    <option value="2">Yesterday</option>
                    <option value="3">Week To date</option>
                    <option value="4">Month To Date</option>
                    <option value="5">Year To Date</option>
                    <option value="6">Last Week</option>
                    <option value="7">Last Month</option>
                    <option value="0">Custom</option>
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
        </>
    )
}

export default Filters
