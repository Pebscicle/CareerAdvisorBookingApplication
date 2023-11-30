package careeradvisorappointmentbooker.service;

import java.util.List;

import careeradvisorappointmentbooker.model.*;

public interface IAppointmentService {

    /**
     * 
     * 
     */
    Appointment getBookedAppointment(String appointmentID);

    /**
     * 
     */
    List<Appointment> getBookedAppointments(int studentNumber);

    /**
     * 
     */
    List<Appointment> getAdvisorAppointments(String advisorID);

    /**
     * 
     * @param degreeProgram
     * @return List<Advisor> of advisors for a given degree program.
     */
    List<Advisor> getAdvisorsByDegreeProgram(String degreeProgram);
    
    /**
     * 
     */
    Advisor getAdvisorByLogin(String name, String password);

    /*
     * 
     */
    Advisor getAdvisorByNameAndProgram(String name, String degreeProgram);

    /*
     * 
     */
    Advisor blockUnblockTimeslots(boolean block, Advisor a, int sD, int sH, int eD, int eH);
    
    /**
     * 
     */
    // getAvailableTimeslots(Advisor careerAdvisor);

    /**
     * 
     */
    void bookAppointment(Appointment appt);

    /**
     * 
     */
    boolean cancelAppointment(Appointment appt); 

    /**
     * 
     */
    boolean hasStudentBookedAppointments(int studentNumber);

    /**
     * 
     */
    boolean hasAlreadyBookedInWeek(Appointment appt);

    /**
     * 
     */
    boolean isValidAppointment(Appointment appt);

    /**
     * 
     */
    boolean isAppointmentAvailable(Appointment appt);

    /**
     * 
     */
    boolean isAppointmentExistent(Appointment appointment);

    /**
     * 
     */
    boolean hasMeetingComments(String comments);

}
