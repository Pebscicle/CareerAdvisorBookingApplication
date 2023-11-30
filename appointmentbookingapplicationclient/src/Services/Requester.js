
//Author Student Number: 2925529

class Requester
{

    async getStudentAppointments(studentNumber)
    {
        //@GetMapping("/appointments/{studentNumber}")
        let url = "http://localhost:8080/appointments/student/"+studentNumber
        let anError = "";
        let aResponse = "";
        let aSuccess = true;

        try
        {
            const response = await fetch(url);
            const data = await response.json();
            anError = "Student's schedule fetched."

            //console.log(response);
            //console.log(data);

            if(data != null)
            {
                aResponse = data;
                anError = "Student's schedule fetched successfully";
                console.log("Student's schedule fetched successfully");
            }
            else
            {
                aResponse = data;
                aSuccess = false;
                anError = "Student's schedule fetched unsuccessfully: " + data.error;
                console.log("Student's schedule fetched unsuccessfully: " + data.error);
            }
        }
        catch(error)
        {
            console.log(error);
        }

        return {isSuccessful: aSuccess, errorMessage: anError, responseData: aResponse}
    }

    async getAdvisor(name, degreeProgram)
    {
        //@GetMapping("/advisors/{degreeProgram}/{name}")  
        let url = "http://localhost:8080/advisors/"+degreeProgram+"/"+name;
        let anError = "";
        let aResponse = "";
        let aSuccess = true;

        try 
        {
            const response = await fetch(url);
            const data = await response.json();
            aResponse = data;
            anError = "Advisors fetched"

        }
        catch(error) 
        {
            console.log(error);
        }

        return {isSuccessful: aSuccess, errorMessage: anError, responseData: aResponse}
    
    }

    async getRelevantAdvisors(program)
    {
        //@GetMapping("/advisors/{degreeProgram}")
        let url = "http://localhost:8080/advisors/"+program;
        let anError = "";
        let aResponse = "";
        let aSuccess = true;

        try 
        {
            const response = await fetch(url);
            const data = await response.json();
            aResponse = data;
            anError = "Advisors fetched"

        }
        catch(error) 
        {
            console.log(error);
        }

        return {isSuccessful: aSuccess, errorMessage: anError, responseData: aResponse}
    }

    async postAppointment(appt)
    {
        //console.log("appt at postAppointment");
        //console.log(JSON.stringify(appt));

        let url = "http://localhost:8080/appointments"
        let anError = ""
        let aResponse = ""
        let aSuccess = true;

        try
        {
            const response = 
            await fetch(url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(appt)
            });
            const result = await response.json();
            console.log("POST:")
            console.log(response);
            console.log(result);
            if(result.success)
            {
            aResponse = result;
            anError = "Appointment Booked Successfully";
            console.log("Appointment Booked Successfully");
            }
            else
            {
            aResponse = result;
            aSuccess = false;
            anError = "Error booking appointment: " + result.error;
            console.log("Error booking appointment: " + result.error);
            }
        }
        catch(error)
        {
            console.log(error);
        }

        return {isSuccessful: aSuccess, errorMessage: anError, responseData: aResponse}
    }

    async cancelMeeting(number, timeslot)
    {

        let url = "http://localhost:8080/appointments/"+number/*+"?timeslot="+timeslot*/;
        let anError = "";
        let aResponse = "";
        let aSuccess = true;

        try
        {
            const response = 
            await fetch(url,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(timeslot)
            });
            console.log(response);

            const result = await response;

            console.log(result);
            
            console.log("DELETE:")
            console.log(response);
            console.log(result);
            if(result.status === 204)
            {
                aResponse = result;
                anError = "Appointment Deleted Successfully";
                console.log("Appointment Deleted Successfully");
            }
            else
            {
                aResponse = result;
                aSuccess = false;
                anError = "Error deleting appointment: " + result.error;
                console.log("Error deleting appointment: " + result.error);
            }
        }
        catch(error)
        {
            console.log(error);
        }

        return {isSuccessful: aSuccess, errorMessage: anError, responseData: aResponse}
    }









    //ADVISOR FUNCTIONALITIES

    async getAdvisorAppointments(advisorID)
    {
        //@GetMapping("/appointments/{advisorID})
        let url = "http://localhost:8080/appointments/advisor/"+advisorID
        let anError = "";
        let aResponse = "";
        let aSuccess = true;

        try
        {
            const response = await fetch(url);
            const data = await response.json();
            anError = "Advisor's schedule fetched.";

            console.log(response);
            console.log(data);

            if(data != null)
            {
                aResponse = data;
                anError = "Advisor's schedule fetched successfully";
                console.log("Advisor's schedule fetched successfully");
            }
            else
            {
                aResponse = data;
                aSuccess = false;
                anError = "Advisor's schedule fetched unsuccessfully: " + data.error;
                console.log("Advisor's schedule fetched unsuccessfully: " + data.error);
            }
        }
        catch(error)
        {
            console.log(error);
        }

        return {isSuccessful: aSuccess, errorMessage: anError, responseData: aResponse}
    }




    async blockSlots(isBlock, advisor, startDate, startHour, endDate, endHour)
    {
        //@GetMapping("/advisors/updateAvailability")
        console.log(advisor);
        console.log(startDate);
        console.log(startHour);

        console.log(endDate);
        console.log(endHour);
        console.log(isBlock);

        let url = "http://localhost:8080/advisors/updateAvailability?";
        url += `startDate=${startDate}&startHour=${startHour}&endDate=${endDate}&endHour=${endHour}&isBlock=${isBlock}`
        let anError = "";
        let aResponse = "";
        let aSuccess = true;

        try 
        {
            const response = await fetch(url,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(advisor)
                });
            const data = await response.json();
            aResponse = data;
            anError = "Advisors fetched"

        }
        catch(error) 
        {
            console.log(error);
        }

        return {isSuccessful: aSuccess, errorMessage: anError, responseData: aResponse}     
    }


}

export default Requester;