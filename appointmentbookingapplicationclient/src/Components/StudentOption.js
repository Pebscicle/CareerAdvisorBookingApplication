 
import React, {useState} from 'react';

function StudentOption( {statusMessage, selectedSlot, advisors, handleSeeStudentSchedule, handleShowAvailability, handleMakeBooking, handleCancelMeeting})
{
const [selectedAdvisorIndex, setSelectedAdvisorIndex] = useState(0);
const [meetingComments, setMeetingComments] = useState("");
let selectedSlotString = selectedSlot === null ? "NONE" : (selectedSlot.startHour+"h-"+(selectedSlot.startHour+1)+"h "+selectedSlot.day+"/"+selectedSlot.month+"/"+selectedSlot.year);

const renderAdvisorOptions = () =>
{
    if(advisors!= null)
    {
      return getAdvisorDropdownOptions(advisors);
    }
}

const handleApptAvailabilityClick = () =>
{
  let advisor = advisors === null ? {} : advisors[selectedAdvisorIndex];
  handleShowAvailability(advisor);  
}

const handleBookMeetingButtonClick = () =>
{
  handleMakeBooking(meetingComments, advisors[selectedAdvisorIndex]);
}


const handleStudentScheduleClick = () => 
{
  handleSeeStudentSchedule();
}

const handleCancelMeetingButtonClick = () =>
{
  handleCancelMeeting()
}

return(
    <>
        <h2>Appointment Booking</h2>
        
        <button type="button" onClick={() => handleStudentScheduleClick()}>List Your Schedule</button>

        <p>Select Career Advisor: </p>
        <select onChange={(event) => {setSelectedAdvisorIndex(event.target.value);}}> 
            {renderAdvisorOptions()}
        </select>

        <button type="button" onClick={() => handleApptAvailabilityClick()}>List Available Appointments</button>

        <p>Selected Time Slot: {selectedSlotString}</p>

        <textarea onChange={(event) => {setMeetingComments(event.target.value);}} rows="5" cols="30" placeholder="Meeting Comments"></textarea>

        <button type="button" onClick={() => handleBookMeetingButtonClick()}>Book Meeting</button>

        <br/><br/>

        <button type="button" onClick={() => handleCancelMeetingButtonClick()}>Cancel Meeting</button>

        <br/><br/>
        <p>Output: {statusMessage}</p>

    </>
);
}


function getAdvisorDropdownOptions(advisors)
{
let options = [];
if(advisors.length > 1)
{
  for(let i = 0; i < advisors.length; i++)
  {
    let advisor = advisors[i].name;
    options.push(<option key={`${advisor}+${i}}`} value={i}>{advisor}</option>);
  }
}
else
{
  options = <option value={0}>{advisors[0].name}</option>
}


return options;
}

export default StudentOption;