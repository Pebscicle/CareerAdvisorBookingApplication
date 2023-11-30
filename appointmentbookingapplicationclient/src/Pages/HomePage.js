
import React from 'react';
import {useNavigate} from "react-router-dom";

import './Page.css';

//Author Student Number: 2925529

//Components
import LoginPrompt from '../Components/LoginPrompt';

//Models


function HomePage() {
    //React Hooks
    const navigate = useNavigate();

    //Callback functions
    const handleStudentLogin = (studentData) => {
      console.log("Student data: ");
      console.log(studentData);

      navigate("/studentui", { state: { studentData } });
    };

    const handleAdvisorLogin = (advisorData) => {
      console.log("Advisor data: ");
      console.log(advisorData);

      navigate("/advisorui", { state: { advisorData } });
    }

    return (
      <div className="homepage-container">
        <LoginPrompt handleStudentLogin={handleStudentLogin} handleAdvisorLogin={handleAdvisorLogin}></LoginPrompt>
      </div>
    )
}

export default HomePage;