
import React, {useState}  from 'react';

import './LoginPrompt.css';

function LoginPrompt({handleStudentLogin, handleAdvisorLogin}) {
    /*Login State Variables*/
    const [loginType, setLoginType] = useState("n"); //n: no login type selected | s: student login | a: advisor login"
    const [studentNumber, setStudentNumber] = useState("");
    const [advisorName, setAdvisorName] = useState("");
    const [advisorPassword, setAdvisorPassword] = useState("");
    const [loginErrorMessage, setLoginErrorMessage] = useState("");

    /*Event handler for when either login button clicked to change state*/
    const handleLoginTypeClick = (loginType) => {
      setLoginType(loginType);
    };

    //Callback function to send student number to home page.
    const handleStudentLoginClick = () =>
    {
      attemptStudentLogin(studentNumber).then(loginResults =>
      {
        if(loginResults.isSuccessful)
        {
          setLoginErrorMessage(loginResults.errorMessage)
          handleStudentLogin(loginResults.responseData);
        }
        else
        {
          setLoginErrorMessage(loginResults.errorMessage)
        }
      });      
    }

    //Callback function to send advisor details to home page.
    const handleAdvisorLoginClick = () =>
    {
      if(advisorName == "" || advisorName == null || advisorPassword == "" || advisorPassword == null)
      {
        setLoginErrorMessage("A field(s) is empty.");
      }
      else
      {
        attemptAdvisorLogin(advisorName, advisorPassword).then(loginResults =>
        {
          if(loginResults.isSuccessful)
          {
            console.log("");
            console.log("Logged in successfully");
            console.log(loginResults.responseData);
            setLoginErrorMessage(loginResults.errorMessage);
            handleAdvisorLogin(loginResults.responseData);
          }
          else
          {
            console.log("");
            console.log("Login failure");
            console.log(loginResults.responseData);
            setLoginErrorMessage(loginResults.errorMessage);
          }
        }); 
      }
    }

    const renderLoginSelection = () =>
    {
      //RENDER LOGIN SELECTION IF TYPE NOT YET SELECTED
      if(loginType === "n")
      {
        return(
        <div className="login-selection">
          <button type="button" onClick={() => handleLoginTypeClick("s")} style={{marginRight: "10px"}}>Student</button>
          <button type="button" onClick={() => handleLoginTypeClick("a")}>Career Advisor</button>
        </div>
        );
      }
      return null;
    }

    const renderLoginContent = () => 
    {
      //RENDER STUDENT LOGIN PROMPT
      if(loginType === "s")
      {
        return(
        <div className="login-content">
          <p>Student number:</p>
          <input id="studentNumberField" type="number" placeholder="e.g. 123" value={studentNumber} onChange={(event) => setStudentNumber(event.target.value)}></input>
          <button type="button" onClick={handleStudentLoginClick}>Login Student</button>
          <p className="login-error-messages">{loginErrorMessage}</p>
        </div>
        )
      }
      if(loginType === "a")
      {
        return(
        <div className="login-content">
          <p>Career Advisor</p>
          <input id="careerAdvisorNameField" placeholder="e.g. Bob Good" value={advisorName} onChange={(event) => setAdvisorName(event.target.value)}></input>
          <p>Password</p>
          <input id="careerAdvisorPasswordField" value={advisorPassword} onChange={(event) => setAdvisorPassword(event.target.value)}></input>
          <button type="button" onClick={handleAdvisorLoginClick}>Login Advisor</button>
          <p className="login-error-message">{loginErrorMessage}</p>
        </div>
        )
      }
      return null;
    }

    return (
      <div className="login-prompt">
        <div className="login-title">Pick Login Type</div>
        {renderLoginSelection()}
        {renderLoginContent()}
      </div>
    )
}

async function attemptStudentLogin(sNumber)
{
  let url = "https://pmaier.eu.pythonanywhere.com/sits/student/"+sNumber;
  let anError = ""
  let aResponse = ""
  let aSuccess = true;

  try 
  {
    const response = await fetch(url);
    if(response.status === 404)
    {
      anError = "NOT FOUND 404: Student number not found: " + response.status;
      aSuccess = false;
    }
    else
    {
      const data = await response.json();
      aResponse = JSON.stringify(data);
      anError = "Login Successful"
    }
  } catch (error) 
  {
    console.log(error);
  }

  return {isSuccessful: aSuccess, errorMessage: anError, responseData: aResponse}
}

async function attemptAdvisorLogin(aName, aPassword)
{
  let url = "http://localhost:8080/advisors/login/"+aName+"?password="+aPassword;
  let anError = ""
  let aResponse = ""
  let aSuccess = true;

  try 
  {
    const response = await fetch(url);
    if(response.status === 401)
    {
      anError = "Login credentials incorrect: " + response.status;
      aSuccess = false;
    }
    else
    {
      const data = await response.json();
      aResponse = JSON.stringify(data);
      anError = "Login Successful"
    }
  } catch (error) 
  {
    console.log(error);
  }

  return {isSuccessful: aSuccess, errorMessage: anError, responseData: aResponse}
}

export default LoginPrompt;