
import React, {useState} from 'react';
import {Link, useLocation} from "react-router-dom";

import './Page.css';

//Author Student Number: 2925529

//Components
import Sidebar from '../Components/Sidebar'
import Calendar from '../Components/Calendar/Calendar';
import AdvisorOption from '../Components/AdvisorOption';

//Services
import Requester from "../Services/Requester"

//Helper Objects
const requester = new Requester();


function AdvisorPage() {
  //React Hooks
  const location = useLocation();

  /*Advisor State Variables*/
  const [weekIndex, setWeekIndex] = useState(0);
  const advisorData = location.state === null ? null : JSON.parse(location.state.advisorData);
  const [headerText, setHeaderText] = useState(advisorData === null ? "Career Advisor's Appointments" : advisorData.name + "'s Appointments");
  const [appointmentData, setAppointmentData] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  const updateWeekIndex = (add) =>
  {
    if(weekIndex <= 2 && weekIndex > 0 && add === -1)
    {
      let index = weekIndex;

      setWeekIndex(index-1);
      //handleShowAvailability(selectedAdvisor);
    }
    else if(weekIndex >= 0 && weekIndex < 2 && add === 1)
    {
      let index = weekIndex;

      setWeekIndex(index+1);
      //handleShowAvailability(selectedAdvisor);
    }
  }

  //Callback Methods:

  const performActionForTimeslotClick = (timeslot) =>
  {
    console.log("performActionForTimeslotClick UNIMPLEMENTED");
    //setStatusMessage("");
    //setSelectedTimeslot(appointmentData[timeslot]);
  }

  const handleBlockSlots = (isBlock, sd, sh, ed, eh) =>
  {
    requester.blockSlots(isBlock, advisorData, sd, sh, ed, eh).then(advisor =>
      {
        console.log("");
        console.log("Successfully blocked slots.");
        console.log(advisor.responseData);
        console.log(advisor);
      })
  }

  const handleViewAppointments = () =>
  {
    requester.getAdvisorAppointments(advisorData.advisorID).then(appointmentsData =>
      {
        console.log("");
        console.log("getAdvisorAppointments():");
        console.log(appointmentsData.responseData);

        setAppointmentData(appointmentsData.responseData);
      })
  }

  //Render content
  const renderContent = () =>
  {
    if(advisorData)
    {
      return(
        <>
        <header className="page-header">
          <button type="button" onClick={() => updateWeekIndex(-1)}>Previous Week</button>
          {headerText}
          <button type="button" onClick={() => updateWeekIndex(1)}>Next Week</button>
        </header>

        <div className="page-content-container">
          <Sidebar sidebarOption={<AdvisorOption statusMessage={statusMessage} handleViewAppointments={handleViewAppointments} handleBlockSlots={handleBlockSlots} />} />
          <Calendar performActionForTimeslotClick={performActionForTimeslotClick} appointmentData={appointmentData} weekIndex={weekIndex}></Calendar>
        </div>
        </>
      );
    }
    else
    {
      return(
        <h1>No Advisor Logged In. Please return to <Link to={"/"}>home page</Link></h1>
      );
    }
  }

  return (
    <div className="page-container">
      {renderContent()}
    </div>
  )
}

export default AdvisorPage;