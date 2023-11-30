 
import React, {useState} from 'react';

//Resources
const days = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
const timeslotHours = [9, 10, 11, 12, 13, 14, 15, 16];

 function AdvisorOption( {handleViewAppointments, handleBlockSlots} )
 {
    let dateOptions = renderDateOptions();
    let timeslotHourOptions = renderTimeslotHourOptions();

    const [startDate, setStartDate] = useState(3);
    const [endDate, setEndDate] = useState(3);
    const [startTimeslotHour, setStartTimeslotHour] = useState(9);
    const [endTimeslotHour, setEndTimeslotHour] = useState(9);

    const [errorMessage, setErrorMessage] = useState("");

    
    //Callbacks

    const handleBlockSlotsButtonClick = (isBlock) =>
    {
        if(startDate > endDate)
        {
            setErrorMessage("Error blocking off slots: Start Date > End Date");
        }
        else if(startDate == endDate && startTimeslotHour >= endTimeslotHour)
        {
            setErrorMessage("Error blocking off slots: Start Timeslot Hour >= End Timeslot Hour");
        }
        else
        {
            setErrorMessage("Blocking/Unblocking slots, successful");
            handleBlockSlots(isBlock, startDate, startTimeslotHour, endDate, endTimeslotHour);
        }
    }

    const handleViewAppointmentsButtonClick = () =>
    {
        setErrorMessage("Displaying advisor appointments...");
        handleViewAppointments();
    }


    return(
        <>
            <h2>Appointments</h2>

            <button type="button" onClick={() => handleViewAppointmentsButtonClick()}>View Appointments</button>
            
            <h3>Manage Availability</h3>
           
            <div>
                <h5>Start Date and Time</h5>

                <span>Date </span>
                <select onChange={(event) => {setStartDate(parseInt(event.target.value));}}>
                    {dateOptions}
                </select>
                <span>Timeslot </span>
                <select onChange={(event) => {setStartTimeslotHour(parseInt(event.target.value));}}>
                    {timeslotHourOptions}
                </select>
            </div>

            <div>
                <h5>End Date and Time</h5>
            
                <span>Date </span>
                <select onChange={(event) => {setEndDate(parseInt(event.target.value));}}>
                    {dateOptions}
                </select>
                <span>Timeslot </span>
                <select onChange={(event) => {setEndTimeslotHour(parseInt(event.target.value));}}>
                    {timeslotHourOptions}
                </select>
            </div>

            <br/><br/>
            <span>
                <button type="button" onClick={() => handleBlockSlotsButtonClick(true)}>Block Slot</button>
                <button type="button" onClick={() => handleBlockSlotsButtonClick(false)}>Unblock Slot</button>
            </span>

            <br/><br/>
            <p>Output: {errorMessage}</p>
        </>
    );
 }

function renderDateOptions()
{
    let dateOptions = [];

    for(let i = 0; i < days.length; i++)
    {
        let day = days[i];
        dateOptions.push(<option key={`day${day}`} value={day}>{day}</option>);
    }

    return dateOptions;
}

function renderTimeslotHourOptions()
{
    let timeslotHourOptions = [];

    for(let i = 0; i < timeslotHours.length; i++)
    {
        let timeslotHour = timeslotHours[i];
        timeslotHourOptions.push(<option key={`timeslot${timeslotHour}`} value={timeslotHour}>{timeslotHour}</option>);
    }

    return timeslotHourOptions;
}

export default AdvisorOption;