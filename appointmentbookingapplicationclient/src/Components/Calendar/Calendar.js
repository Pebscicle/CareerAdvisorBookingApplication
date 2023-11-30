
import React, {useState} from 'react';

import './Calendar.css';

//Components
import CalendarCell from './CalendarCell';

const availableColor = "#5FCB65";
const unavailableColor = "#CB5F5F";
const neitherColor = "#FFFFFF";

const bookableString = "BOOK";
const unbookableString = "UNAVAILABLE";

const week1 = ['Sunday 3rd', 'Monday 4th', 'Tuesday 5th', 'Wednesday 6th', 'Thursday 7th', 'Friday 8th', 'Saturday 9th'];
const week2 = ['Sunday 10th', 'Monday 11th', 'Tuesday 12th', 'Wednesday 13th', 'Thursday 14th', 'Friday 15th', 'Saturday 16th'];
const week3 = ['Sunday 17th', 'Monday 18th', 'Tuesday 19th', 'Wednesday 20th', 'Thursday 21st', 'Friday 22nd', 'Saturday 23rd'];
const weekDays = [week1, week2, week3];
const timeSlotHours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM'];
const correspondingTimeSlotHours = [9, 10, 11, 12, 13, 14, 15, 16];


function Calendar( {performActionForTimeslotClick, weekIndex, appointmentData} ) {

  //Callbacks
  const performActionFromCell = (cellContents) =>
  {
    //console.log(cellContents);
    performActionForTimeslotClick(cellContents);
  }

  let calendarCells = returnTimeslotCells(weekIndex, appointmentData, performActionFromCell);


  //RETURN HTML FOR CALENDAR
  return (
    <div className="calendar-container">
        <CalendarCell performAction={() => {}} bgColor={"#FFFFFF"} key={"timeslot"} content={"Time Slots"} />
        {weekDays[weekIndex].map((day) => (
          <CalendarCell performAction={() => {}} bgColor={"#FFFFFF"} key={day} content={day}/>
        ))}
        
        {calendarCells}
    </div>
  );
}

function returnTimeslotCells(wIndex, apptData, callback) 
{
  let currentTimeslotIndex = 0;
  let color;
  let contentString;
  let calendarCells = [];
  for(let i = 0; i < timeSlotHours.length; i++)
  {
    calendarCells.push
    (
      <CalendarCell performAction={() => {}} bgColor={neitherColor} key={timeSlotHours[i]} content={timeSlotHours[i]} />
    )
    for(let j = 0; j < weekDays[0].length; j++)
    {
      if(apptData != null)
      {
        
        //console.log("The appointment data!");
        //console.log(apptData);

        let showAdvisor = apptData[0].timeslotAvailable === undefined ? false : true;
        //IF CALENDAR CELLS TO DISPLAY ARE TIMESLOT AVAILABILITY.
        if(showAdvisor)
        {
          let actualIndex = (wIndex*56 + currentTimeslotIndex+(j-i)*(8-1)) + i;
          let available = apptData[actualIndex].timeslotAvailable
          color = available ? availableColor : unavailableColor;
          contentString = available ? bookableString : unbookableString;
          
          /*let timeslotMatches = false;

          for(let k = 0; k < apptData.length; k++)
          {
            let currApptTimeslot = apptData[k].timeslot;
            if(apptData[0].timeslot.day == currDay && apptData[0].timeslot.startHour == currHour)
            {
              console.log("Appointment Day matches current day and hour!");
              timeslotMatches = true;
            }
          }*/

          //console.log(wIndex);
          //console.log(weekDays[wIndex][j]+actualIndex);

          calendarCells.push
          (
            <CalendarCell timeslotIndex={actualIndex} performAction={callback} bgColor={color} key={weekDays[wIndex][j]+actualIndex} content={contentString} />
          );

        }
        //IF CALENDAR CELLS TO DISPLAY ARE NOT TIMESLOTS BUT RATHER APPOINTMENTS
        else
        {
          let defaultColor = "#ffffff";
          let appointmentColor = "#edd89d";


          let dayString = (weekDays[wIndex][j].split(" ")[1]);
          let justDay = dayString.length === 4 ? dayString.slice(0, 2) : dayString[0];
          let currDay = parseInt(justDay);

          let currHour = correspondingTimeSlotHours[i];


          let timeslotMatches = false;
          let apptIndex = 0;

          //Loop through student's appointments and if timeslots are corresponding, display on Calendar!
          for(let k = 0; k < apptData.length; k++)
          {
            let currApptTimeslot = apptData[k].timeslot;
            if(currApptTimeslot.day == currDay && currApptTimeslot.startHour == currHour)
            {
              //console.log("Appointment Day matches current day and hour!");
              timeslotMatches = true;
              apptIndex = k;
            }
          }

          let color = timeslotMatches ? appointmentColor : defaultColor;
          let contentString = timeslotMatches ? 
          ("Apt with: " + apptData[apptIndex].studentName) + "["+apptData[apptIndex].studentNumber+"]"
          + " and " + apptData[apptIndex].advisor.name
          + " | Cmts: " + apptData[apptIndex].meetingComments
          : ".";

          /*console.log(apptData);
          console.log(currDay);
          console.log(currHour);*/

          calendarCells.push
          (
            <CalendarCell timeslotIndex={(56*wIndex)+i} performAction={() => callback(apptIndex)} bgColor={color} key={weekDays[wIndex][j]+timeSlotHours[i]} content={contentString} />
          );

        }
      }
      else
      {
        calendarCells.push
        (
          <CalendarCell performAction={() => {}} key={timeSlotHours[i]+weekDays[wIndex][j]} content={contentString} />
        );
      }
      
      currentTimeslotIndex++;
    }
  }

  //console.log(calendarCells);
  return calendarCells;
}



export default Calendar;
