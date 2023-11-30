package careeradvisorappointmentbooker.controller;

//Author Student Number: 2925529

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import careeradvisorappointmentbooker.model.*;
import careeradvisorappointmentbooker.service.*;

@CrossOrigin
@RestController
public class AppointmentController {

    // The controller uses the appointment service to do the business logic.
    private IAppointmentService as;

    /*
     * Dependency injection
     */
    public AppointmentController(IAppointmentService appointmentService) {
        this.as = appointmentService;
    }



    @GetMapping("/appointments/student/{studentNumber}")        
    public ResponseEntity<List<Appointment>> getStudentAppointments(@PathVariable int studentNumber/*,@RequestParam(required=false) String name COULD LOOK FOR ONLY ONES THAT FOLLOW CERTAIN DATES?*/) {
        
        printControllerRequest("getStudentAppointments("+studentNumber+") called at @GetMapping(\"/appointments/student/{studentNumber}\")");
        
        //Validate that student has booked meetings
        if(!as.hasStudentBookedAppointments(studentNumber))
        {
            System.out.println("404 NOT FOUND: Student " + studentNumber + " does not have booked appointments.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        System.out.println("Student " + studentNumber + " has booked appointments.");

        List<Appointment> studentBookedAppointments = as.getBookedAppointments(studentNumber);

        System.out.println("Success: returned appointments for student.");
        return ResponseEntity.ok(studentBookedAppointments);
    }

    @GetMapping("/advisors/login/{name}")
    public ResponseEntity<Advisor> getAdvisorFromLogin(@PathVariable String name, @RequestParam(required=true) String password)
    {
        printControllerRequest("getAdvisorFromLogin("+name+", "+password+") called at @GetMapping(\"/advisors/login/{name}\")");

        Advisor advisor = as.getAdvisorByLogin(name, password);
        if(advisor == null)
        {
            System.out.println("401 UNAUTHORIZED: Advisor is null.");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Advisor is null");
        }
    
        System.out.println("Success: returned advisor for login.");
        return ResponseEntity.ok(advisor);
    }

    @GetMapping("/advisors/{degreeProgram}/{name}")
    public ResponseEntity<Advisor> getAdvisorByNameAndProgram(@PathVariable String degreeProgram, @PathVariable String name)
    {
        printControllerRequest("getAdvisorByNameAndProgram("+degreeProgram+", "+name+") called at @GetMapping(\"/advisors/{degreeProgram}/{name}\")");

        Advisor advisor = as.getAdvisorByNameAndProgram(name, degreeProgram);
        if(advisor == null)
        {
            System.out.println("404 NOT FOUND: Advisor is null.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Advisor is null");
        }

        System.out.println("Success: returned advisor from degree program and name.");
        return ResponseEntity.ok(advisor);
    }

    @GetMapping("/advisors/{degreeProgram}")
    public ResponseEntity<List<Advisor>> getAdvisorsByDegreeProgram(@PathVariable String degreeProgram)
    {
        printControllerRequest("getAdvsiorsByDegreeProgram("+degreeProgram+") called at @GetMapping(\"/advisors/{degreeProgram}\")");

        List<Advisor> advisors = as.getAdvisorsByDegreeProgram(degreeProgram);
        if(advisors.size() == 0 || advisors == null)
        {
            System.out.println("404 NOT FOUND: Advisors is empty.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Advisors is null or empty.");
        }

        System.out.println("Success: returned advisors from degree program.");
        return ResponseEntity.ok(advisors);
    }

    @GetMapping("/appointments/advisor/{advisorID}")
    public ResponseEntity<List<Appointment>> getAdvisorAppointments(@PathVariable String advisorID)
    {
        printControllerRequest("getAdvisorAppointments("+advisorID+") called at @GetMapping(\"/appointments/advisor/{advisorID}\")");

        if(advisorID == null || advisorID.equals(""))
        {
            System.out.println("400 BAD REQUEST: advisorID is null or empty.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "advisorID is null or empty.");
        }
        System.out.println("advisorID is correct: " + advisorID);

        //Get list of appointments for given advisor
        List<Appointment> advisorAppointments = as.getAdvisorAppointments(advisorID);
        if(advisorAppointments.size() == 0)
        {
            System.out.println("404 NOT FOUND: No appointments found for this advisorID");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No appointments found for this advisorID");
        }
        System.out.println("Advisor appointments list > 0");


        System.out.println("Success: returned list of appointments for given advisor.");
        return ResponseEntity.ok(advisorAppointments);
    }

    @PutMapping("/advisors/updateAvailability")
    public ResponseEntity<Advisor> updateAdvisorTimeslotAvailability(
        @RequestBody Advisor advisor,
        @RequestParam(required=true) int startDate,
        @RequestParam(required=true) int startHour,
        @RequestParam(required=true) int endDate,
        @RequestParam(required=true) int endHour,
        @RequestParam(required=true) boolean isBlock
    )
    {
        printControllerRequest("updateAdvisorTimeslotAvailability("+startDate+", "+startHour+", "+endDate+", "+endHour+", "+isBlock+") called at @PutMapping(\"/advisors/updateAvailability\")");

        //No need to check if RequestParams are null, they are required.

        if(advisor == null)
        {
            System.out.println("400 BAD REQUEST: Supplied advisor incorrect.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid advisor data supplied.");
        }
        System.out.println("Supplied correct advisor data.");

        Advisor updatedAdvisor = as.getAdvisorByNameAndProgram(advisor.getName(), advisor.getDegreeProgram());
        
        if(updatedAdvisor == null)
        {
            System.out.println("404 NOT FOUND: This advisor is not found.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Advisor not found.");
        }
        System.out.println("Advisor found, can block/unblock time slots.");

        //Update advisor's availabilities
        updatedAdvisor = as.blockUnblockTimeslots(isBlock, updatedAdvisor, startDate, startHour, endDate, endHour);

        HttpHeaders headers = new HttpHeaders();
        //headers.add("Access-Control-Allow-Origin", "http://localhost:3000");
        headers.add("Access-Control-Allow-Credentials", "true");
        headers.add("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization");

        String blockedOrNotString = isBlock ? "Blocked" : "Unblocked";
        System.out.println("Success: " + blockedOrNotString + " time slots successfully.");
        return new ResponseEntity<>(updatedAdvisor, headers, HttpStatus.OK);
    }
 
    @PostMapping("/appointments")
    public ResponseEntity<String> bookAppointment(@RequestBody Appointment appointment) 
    {
        printControllerRequest("bookAppointment() called at @PostMapping(\"/appointments\")");

        //Verify that a student can book appointment
        if(!as.isValidAppointment(appointment))
        {
            System.out.println("400 BAD REQUEST: Appointment details incorrect.");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Appointment details incorrect.");
        }
        System.out.println("Appointment details valid.");
        String comments = appointment.getMeetingComments();
        if(!as.hasMeetingComments(comments))
        {
            System.out.println("400 BAD REQUEST: No meeting comments supplied.");
             throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No meeting comments supplied.");
        }
        System.out.println("Appointment has meeting comments");
        if(as.hasAlreadyBookedInWeek(appointment))
        {
            System.out.println("409 CONFLICT: Student has already booked an appointment this week.");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Student has already booked an appointment this week.");
        }
        System.out.println("Student has not yet booked an appointment this week.");
        if(!as.isAppointmentAvailable(appointment))
        {
            System.out.println("409 CONFLICT: Appointment in this timeslot is unavailable.");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Appointment in this timeslot is unavailable.");
        }
        System.out.println("Appointment timeslot is available.");
        if(as.isAppointmentExistent(appointment))
        {
            System.out.println("409 CONFLICT: Appointment in this timeslot already booked.");
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Appointment already booked.");
        }
        System.out.println("Appointment not already in existence.");
        

        as.bookAppointment(appointment);
        System.out.println("Success: Booked appointment successfully.");
        return ResponseEntity.status(HttpStatus.CREATED).body("Appointment booked successfully.");
    }


    @CrossOrigin
    @DeleteMapping("/appointments/{studentNumber}")
    public ResponseEntity<String> deleteAppointment(@PathVariable int studentNumber, @RequestBody Timeslot timeslot) {

        printControllerRequest("deleteAppointment("+studentNumber+") called at @DeleteMapping(\"/appointments/{studentNumber}\")");

        //Get appointment from studentNumber and timeslot selected -> will look for list of studentappointments, then return from list the one with corresponding timeslot.
        String appointmentID = ""+studentNumber+"-"+timeslot.toString();
        Appointment appt = as.getBookedAppointment(appointmentID);
        
        //Verify that appointment exists.
        if(!as.isAppointmentExistent(appt))
        {
            System.out.println("404 NOT FOUND: This appointment is not found.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        System.out.println("Appointment exists");

        //Access appointmentservice to deleteAppointment(number)
        if(!as.cancelAppointment(appt))
        {
            System.out.println("404 NOT FOUND: This appointment cannot be canceled because it is not found.");
            throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        }
        

        HttpHeaders headers = new HttpHeaders();
        //headers.add("Access-Control-Allow-Origin", "http://localhost:3000");
        headers.add("Access-Control-Allow-Credentials", "true");
        headers.add("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization");


        System.out.println("Success: Booked appointment deleted successfully.");
        return ResponseEntity.status(HttpStatus.NO_CONTENT).headers(headers).body("Appointment record deleted.");
    }




    //HELPER METHODS

    private void printControllerRequest(String requestDescription)
    {
        System.out.println("\n\n");
        System.out.println(requestDescription);
    }
    

}