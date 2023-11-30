
import React, {useState, useEffect} from 'react';
import {Link, useLocation} from "react-router-dom";

import './Page.css';

//Author Student Number: 2925529

//Components
import Sidebar from '../Components/Sidebar'
import Calendar from '../Components/Calendar/Calendar';
import StudentOption from '../Components/StudentOption';

//Services
import Requester from "../Services/Requester"

//Helper Objects
const requester = new Requester();







function StudentPage(props) {
  //React Hooks
  const location = useLocation();

  /*Student State Variables*/
  const [weekIndex, setWeekIndex] = useState(0);
  const studentData = location.state === null ? null : JSON.parse(location.state.studentData).student;
  const [studentAppointments, setStudentAppointments] = useState(null);
  const [advisorData, setAdvisorData] = useState(null);
  const [selectedAdvisor, setSelectedAdvisor] = useState(null);
  const [appointmentData, setAppointmentData] = useState(null);
  const [selectedTimeslot, setSelectedTimeslot] = useState(null);
  let headerString = studentData === null ? "Student's Appointment Booker" : studentData.name + " ["+studentData.number+"]'s Booked Appointments";
  const [headerText, setHeaderText] = useState(headerString);
  const [statusMessage, setStatusMessage] = useState("");








  const updateWeekIndex = (add) =>
  {
    if(weekIndex <= 2 && weekIndex > 0 && add === -1)
    {
      let index = weekIndex;

      setWeekIndex(index-1);
      handleShowAvailability(selectedAdvisor);
    }
    else if(weekIndex >= 0 && weekIndex < 2 && add === 1)
    {
      let index = weekIndex;

      setWeekIndex(index+1);
      handleShowAvailability(selectedAdvisor);
    }
  }

  //Component mounting
  useEffect(() => 
  {
    console.log("");
    console.log("Fetching advsiors from Web Service")
    
    if(studentData != null)
    {
      requester.getRelevantAdvisors(studentData.programme).then(advisors =>
        {
          if(advisors != null)
          {
            let advisordata = advisors.responseData;
            setAdvisorData(advisordata);
          }
        }
      );
    }
  }, []);







  //Callback Functions


  const handleSeeStudentSchedule = () =>
  {
    if(studentData!= null)
    {
      setHeaderText(""+studentData.name + " ["+studentData.number+"]'s Booked Appointments");
      
      let appts = requester.getStudentAppointments(studentData.number).then(appointments =>
        {
          console.log("");
          console.log("Successfully retrieved student's appointments.");
          console.log(appointments.responseData);

          if(appointments.responseData.status == 404)
          {
            setStatusMessage("No appointments booked for this student.");
          }
          else
          {
            let studentAppointments = appointments.responseData;

            if(studentAppointments != null)
            {
              setAppointmentData(studentAppointments);
              setStudentAppointments(studentAppointments);
              setStatusMessage("Successfully retrieved student appointments/");
            }
            else
            {
              setStatusMessage("Unsuccessful in displaying student appointments" + appointments.errorMessage+": "+ appointments.responseData.status);
            }
          }
          
        });

    }
    else
    {
      console.log("Student data null.")
    }
  }

  const handleShowAvailability = (advisor) =>
  {
    if(advisor != null)
    {
      setSelectedAdvisor(advisor);
      setAppointmentData(advisor.timeslots);
      setHeaderText(advisor.name + "'s Available Appointmens");
    }
    
  }

  const performActionForTimeslotClick = (timeslot) =>
  {
    setStatusMessage("");
    let theTimeslot = appointmentData[timeslot].studentNumber == undefined ? appointmentData[timeslot] : appointmentData[timeslot].timeslot;
    setSelectedTimeslot(theTimeslot);
  }

  const handleMakeBooking = (meetingCmts, adv) =>
  {
    let cmts = "";
    if(studentData == null){cmts+="Student Data incorrect. ";}
    if(adv === null || adv === undefined){cmts+="No Advisor selected. ";}
    if(selectedTimeslot == null){cmts+="No Timeslot Selected. ";}
    if(selectedTimeslot != null && selectedTimeslot.timeslotAvailable == false){cmts+="Timeslot is unavailable.";}
    
    //If data validation passes, can create appointment object
    if(cmts === "")
    {
      requester.getAdvisor(adv.name, studentData.programme).then(advResults => 
        {
          console.log("");
          console.log("Retrieved newest version of advisor.");
          console.log(advResults.responseData);

          let updatedAdvisor = advResults.responseData;
          let updatedTimeslot = null;
          for(let i = 0; i < updatedAdvisor.timeslots.length; i++)
          {
            if(
              updatedAdvisor.timeslots[i].startHour == selectedTimeslot.startHour && 
              updatedAdvisor.timeslots[i].day == selectedTimeslot.day
              ){
                updatedTimeslot = updatedAdvisor.timeslots[i];
              }
          }

          const appointment = {
            studentNumber: studentData.number,
            studentName: studentData.name,
            studentDegreeProgram: studentData.programme,
            meetingComments: meetingCmts,
            advisor: updatedAdvisor,
            timeslot: updatedTimeslot
          };
    
    
          //Attempt creating meeting object
          requester.postAppointment(appointment).then(x => 
            {
              if(x.isSuccessful)
              {
                //Succesfully booked meeting. Show that this is the case:
                console.log("");
                console.log("Successfully booked appointment.");
                console.log(x);
                setStatusMessage("Successful in booking meeting.")
                requester.getRelevantAdvisors(studentData.programme).then(advisors =>
                  {
                    console.log("");
                    console.log("Successfully retrieved advisors.");
                    console.log(advisors.responseData);

                    //retrieve advisor for the booked appointment
                    if(advisors != null)
                    {
                      let advisordata = advisors.responseData;
                      let advisorIndex = 0;
                      for(let i = 0; i < advisorData.length; i++)
                      {
                        if(advisorData[i].name === adv.name)
                        {
                          advisorIndex = i;
                        }
                      }
                      setSelectedAdvisor(advisorData[advisorIndex]);
                      setAdvisorData(advisordata);
                      handleShowAvailability(advisordata[advisorIndex]);
                    }
                  });
              }
              else
              {
                //Unsuccesffuly booked meeting. Show that this is the case:
                setStatusMessage("Unsuccessful in booking meeting: " + x.errorMessage+": "+ x.responseData.status)
                console.log("")
                console.log("Unsuccessful in booking appointment");
                console.log(x);
              }
            }
          );
        })
    }
    else
    {
      setStatusMessage(cmts);
    }
  
  }

  const handleCancelMeeting = () =>
  {
    console.log("Attempting to cancel meeting")
    //Get student number and timeslotdata to pass to cancel meeting.
    if(studentData != null && selectedTimeslot != null)
    {
      
      requester.cancelMeeting(studentData.number, selectedTimeslot).then(x =>
        {
          if(x.isSuccessful)
          {
            console.log("");
            console.log("Successfully canceled meeting.");
            console.log(x);
            setStatusMessage(x.errorMessage);
            showStudentSchedule(x);
          }
          else
          {
            console.log("");
            console.log("Unsuccessfully canceled meeting.");
            console.log(x);
            setStatusMessage(x.errorMessage);
          }

        });
    }
    else
    {

    }
  }




  //RENDER COMPONENTS

  const renderContent = () =>
  {
    if(studentData)
    {
      return(
        <>
        <header className="page-header">
          <button type="button" onClick={() => updateWeekIndex(-1)}>Previous Week</button>
          {headerText}
          <button type="button" onClick={() => updateWeekIndex(1)}>Next Week</button>
        </header>

        <div className="page-content-container">
          <Sidebar sidebarOption={
            <StudentOption 
              selectedSlot={selectedTimeslot} 
              statusMessage={statusMessage} 
              handleSeeStudentSchedule={handleSeeStudentSchedule} 
              handleShowAvailability={handleShowAvailability} 
              handleMakeBooking={handleMakeBooking} 
              handleCancelMeeting={handleCancelMeeting}
              advisors={advisorData} />
          } />
          <Calendar performActionForTimeslotClick={performActionForTimeslotClick} appointmentData={appointmentData} weekIndex={weekIndex}></Calendar>
        </div>
        </>
      );
    }
    else
    {
      return(
        <h1>No Student Logged In. Please return to <Link to={"/"}>home page</Link></h1>
      );
    }
  }

  const showStudentSchedule = (appointments) =>
  {
    console.log(appointments);
  }

  return (
    <div className="page-container">
      {renderContent()}
    </div>
  )
}

export default StudentPage;