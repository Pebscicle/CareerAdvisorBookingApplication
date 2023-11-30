package careeradvisorappointmentbooker.service;

//Author Student Number: 2925529

import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

import org.springframework.stereotype.Component;

import careeradvisorappointmentbooker.helper.TimeslotGenerator;
import careeradvisorappointmentbooker.model.Advisor;
import careeradvisorappointmentbooker.model.Appointment;
import careeradvisorappointmentbooker.model.Timeslot;

@Component
public class AppointmentService implements IAppointmentService {

    private boolean IS_DEMO = true;

    //Integer for student IDs as a key, Appointment as the values
    private Map<Integer, List<Appointment>> appointmentDB;

    //Program string as a key, Advisors as the values
    private Map<String, List<Advisor>> advisorDB;

    //Helps determine if already booked in a week
    private int[] week1 = {3, 9};
    private int[] week2 = {10, 16};
    private int[] week3 = {17, 23};

    private final int WEEK_START = 0;
    private final int WEEK_END = 1;

    public AppointmentService()
    {
        appointmentDB = new HashMap<Integer, List<Appointment>>();
        advisorDB = new HashMap<String, List<Advisor>>();

        if(IS_DEMO)
        {
            initializeAdvisorDB();
            initializeDemoAppointments();
        }
        System.out.println("AppointmentService.java instantiated.");
    }









    @Override
    public Appointment getBookedAppointment(String appointmentID)
    {   
        int studentNum = Integer.parseInt(appointmentID.split("-")[0]);
        List<Appointment> studentAppointments = getBookedAppointments(studentNum);

        Appointment apptToReturn = null;

        for(int i = 0; i < studentAppointments.size(); i++)
        {
            Appointment loopAppointment = studentAppointments.get(i);

            if(loopAppointment.getAppointmentID().equals(appointmentID))
            {
                apptToReturn = loopAppointment;
            }
        }
        return apptToReturn;
    }

    @Override
    public List<Appointment> getBookedAppointments(int studentNumber) {

        List<Appointment> bookedAppointments = appointmentDB.get(studentNumber);

        return bookedAppointments;
    }

    @Override
    public List<Appointment> getAdvisorAppointments(String advisorID)
    {
        List<Appointment> advisorAppointments = new ArrayList<>();

        for (Map.Entry<Integer, List<Appointment>> entry : appointmentDB.entrySet())
        {
            Integer studentNumber = entry.getKey();
            List<Appointment> studentAppointments = entry.getValue();
        
            for (Appointment a : studentAppointments) {
                if(a.getAdvisor().getAdvisorID().equals(advisorID))
                {
                    advisorAppointments.add(a);
                }
            }
        }

        return advisorAppointments;
    }

    @Override
    public void bookAppointment(Appointment appt) {
        
        int studentNumber = appt.getStudentNumber();

        //If student not in db already, add them:
        if(!hasStudentBookedAppointments(studentNumber))
        {
            //Creating new student number, appointments list key-value pair.
            List<Appointment> newAppointmentsList = new ArrayList<Appointment>();
            newAppointmentsList.add(appt);
            appointmentDB.put(studentNumber, newAppointmentsList);
        }
        else
        {
            List<Appointment> bookedAppointments = appointmentDB.get(studentNumber);
            bookedAppointments.add(appt);
            appointmentDB.put(studentNumber, bookedAppointments);
        }

        //Once successfully added to database, those timeslots can be set to unavailable
        int latestApptIndex = appointmentDB.get(studentNumber).size()-1;
        Timeslot apptTimeslot = appointmentDB.get(studentNumber).get(latestApptIndex).getTimeslot();
        
        apptTimeslot.setTimeslotAvailability(false);
        appointmentDB.get(studentNumber).get(latestApptIndex).getAdvisor().updateTimeslot(apptTimeslot);

        //Advisor DB must be updated too
        String program = appt.getStudentDegreeProgram();
        updateAdvisor(program, appointmentDB.get(studentNumber).get(latestApptIndex).getAdvisor());
    }

    @Override
    public boolean cancelAppointment(Appointment appointment) 
    {

        List<Appointment> appointments =  getBookedAppointments(appointment.getStudentNumber());

        for(Appointment a: appointments)
        {
            if(a.equals(appointment))
            {
                appointments.remove(appointment);
                appointmentDB.put(appointment.getStudentNumber(), appointments);

                //Update timeslot availability, now that it is canceled.
                for(Timeslot t: a.getAdvisor().getTimeslots())
                {
                    if(t.equals(appointment.getTimeslot()))
                    {
                        t.setTimeslotAvailability(true);
                        a.getAdvisor().updateTimeslot(t);
                        updateAdvisor(a.getAdvisor().getDegreeProgram(), a.getAdvisor());
                    }
                }
                

                return true;
            }
        }
        return false;
    }

    @Override
    public List<Advisor> getAdvisorsByDegreeProgram(String degreeProgram)
    {
        return advisorDB.get(degreeProgram);
    }

    @Override
    public Advisor getAdvisorByLogin(String name, String password)
    {
        Advisor advisor = null;
        for (Map.Entry<String, List<Advisor>> entry : advisorDB.entrySet())
        {
            String advName = entry.getKey();
            List<Advisor> advisors = entry.getValue();
        
            for (Advisor a : advisors) {
                if(a.getName().equals(name) && a.getPassword().equals(password))
                {
                    advisor = a;
                }
            }
        }
        return advisor;
    }

    @Override
    public Advisor getAdvisorByNameAndProgram(String name, String degreeProgram)
    {
        Advisor advisor = null;
        List<Advisor> advisors = getAdvisorsByDegreeProgram(degreeProgram);

        for(Advisor currAdvisor: advisors)
        {
            if(currAdvisor.getName().equals(name) && currAdvisor.getDegreeProgram().equals(degreeProgram))
            {
                advisor = currAdvisor;
            }
        }
        return advisor;
    }

    @Override
    public Advisor blockUnblockTimeslots(boolean block, Advisor advisor, int startDate, int startHour, int endDate, int endHour)
    {
        List<Timeslot> advisorTimeslots = advisor.getTimeslots();
        for(int i = 0; i < advisorTimeslots.size(); i++)
        {
            Timeslot currTimeslot = advisorTimeslots.get(i);

            //If within timeslot days, make timeslot unavailable.
            if(currTimeslot.getDay() >= startDate && currTimeslot.getDay() <= endDate){
                if(
                    !((currTimeslot.getDay() == startDate && currTimeslot.getStartHour() < startHour) ||
                    (currTimeslot.getDay() == endDate && currTimeslot.getStartHour() > endHour))
                ){
                    advisor.getTimeslots().get(i).setTimeslotAvailability(!block);
                } 
            }
        }
        
        updateAdvisor(advisor.getDegreeProgram(), advisor);
        return advisor;
    }

    private void updateAdvisor(String degreeProgram, Advisor adv)
    {
        List<Advisor> advisors = advisorDB.get(degreeProgram);

        for(int i = 0; i < advisors.size(); i++)
        {
            
            if(advisors.get(i).getName().equals(adv.getName()))
            {
                advisors.set(i, adv);
            }
        }
        advisorDB.put(degreeProgram, advisors);
    }

    /*@Override
    public List<Timeslot> getAdvisorTimeslots(String advisorName)
    {

    }*/

    /*
     * VALIDATION METHODS
     */

    /*
    * Method to check if student has booked meetings
    */
    @Override
    public boolean hasStudentBookedAppointments(int studentNumber)
    {
        return appointmentDB.containsKey(studentNumber);
    }

    @Override 
    public boolean hasAlreadyBookedInWeek(Appointment appt)
    {
        List<Appointment> appts = appointmentDB.get(appt.getStudentNumber());

        if(appts!=null)
        {
            int[] currentWeek = null;

            int apptDay = appt.getTimeslot().getDay();
            if(apptDay >= week1[WEEK_START] && apptDay <= week1[WEEK_END])
            {
                currentWeek = week1;
            } 
            else if(apptDay >= week2[WEEK_START] && apptDay <= week2[WEEK_END])
            {
                currentWeek = week2;
            }
            else if(apptDay >= week3[WEEK_START] && apptDay <= week3[WEEK_END])
            {
                currentWeek = week3;
            }

            

            for(Appointment a : appts)
            {
                int day = a.getTimeslot().getDay();
                //IF PREEXISITNG APPOINTMENT IS WITHIN THE WEEK OF THE NEW APPOINTMENT, THEN CANNOT BOOK TWICE IN WEEK
                if(day >= currentWeek[WEEK_START] && day <= currentWeek[WEEK_END])
                {
                    return true;
                }
            }
        }

        return false; //THE APPOINTMENT HAS NOT ALREADY BEEN BOOKED THIS WEEK
    }

    @Override
    public boolean isValidAppointment(Appointment appt)
    {
        String studentName = appt.getStudentName();
        Integer studentNumber = appt.getStudentNumber();
        //String degreeProgram = appt.

        if(hasInvalidStudentData(studentNumber, studentName))
        {
            return false;
        }

        //CHECK OTHER STUFF LIKE IF TIMESLOT AVAILABLE FOR BOOKING, IF STUDENT CAN BOOK, IF CAREER ADVISOR DIDN'T BLOCK IT OFF ETC

        return true;
    }

    @Override
    public boolean isAppointmentAvailable(Appointment appt)
    {
        List<Timeslot> advisorTimeslots = appt.getAdvisor().getTimeslots();

        for(int i = 0; i < advisorTimeslots.size(); i++)
        {
            //If advisor timeslot matches: in that the dates are the same --> Then check if really avaialble.
            if(appt.getTimeslot().equals(advisorTimeslots.get(i)))
            {
                //if timeslot not available
                if(!advisorTimeslots.get(i).isTimeslotAvailable())
                {
                    return false;
                }
            }
        }
        return true;
    }

    public boolean hasMeetingComments(String comments)
    {
        return (!comments.equals("") && comments != null);
    }

    @Override
    public boolean isAppointmentExistent(Appointment appointment)
    {
        if(appointment != null)
        {
            //Get appointments for student
            List<Appointment> bookedAppointments = appointmentDB.get(appointment.getStudentNumber());

            //If null, means students has no booked meetings
            if(bookedAppointments == null)
            {
                return false;
            }

            //Loop through appts to check if appointment IDs match, if so, already exists.

            //studentNum and timeslot string (for searching individual appointment)
            Appointment targetAppointment = getBookedAppointment(appointment.getAppointmentID());

            for(Appointment bookedAppointment: bookedAppointments)
            {
                if(bookedAppointment.equals(targetAppointment))
                {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean hasInvalidStudentData(Integer number, String name)
    {
        return (number == null || name == null || name.equals(""));
    }







    private void initializeAdvisorDB()
    {
        List<Timeslot> defaultTimeslots = TimeslotGenerator.generateTimeslots();

        Advisor john = new Advisor("John Brown", "BSc Hons Mathematics", defaultTimeslots);
        Advisor julia = new Advisor("Julia Roberts", "BSc Hons Software Engineering", defaultTimeslots);
        Advisor plato = new Advisor("Plato", "BA Hons Philosophy", defaultTimeslots);
        Advisor george = new Advisor("George Washington", "BSc Hons Environmental Science", defaultTimeslots);
        Advisor juliette = new Advisor("Juliette Gray", "BSc Hons Data Science", defaultTimeslots);
        Advisor laura = new Advisor("Laura Courte", "BA Hons Philosophy", defaultTimeslots);
        Advisor carl = new Advisor("Carl Black", "BSc Hons Computing Science", defaultTimeslots);
        Advisor doug = new Advisor("Doug Grimsted", "BSc Hons Computing Science", defaultTimeslots);
        Advisor lucas = new Advisor("Lucas Giolito", "BSc Hons Software Engineering", defaultTimeslots);

        List<Advisor> mathAdvisors = new ArrayList<>();
        mathAdvisors.add(john);
        advisorDB.put("BSc Hons Mathematics", mathAdvisors);

        List<Advisor> softwareEngineeringAdvisors = new ArrayList<>();
        softwareEngineeringAdvisors.add(julia);
        softwareEngineeringAdvisors.add(lucas);
        advisorDB.put("BSc Hons Software Engineering", softwareEngineeringAdvisors);

        List<Advisor> philosophyAdvisors = new ArrayList<>();
        philosophyAdvisors.add(plato);
        philosophyAdvisors.add(laura);
        advisorDB.put("BA Hons Philosophy", philosophyAdvisors);

        List<Advisor> environmentalScienceAdvisors = new ArrayList<>();
        environmentalScienceAdvisors.add(george);
        advisorDB.put("BSc Hons Environmental Science", environmentalScienceAdvisors);

        List<Advisor> dataScienceAdvisors = new ArrayList<>();
        dataScienceAdvisors.add(juliette);
        advisorDB.put("BSc Hons Data Science", dataScienceAdvisors);

        List<Advisor> computingScienceAdvisors = new ArrayList<>();
        computingScienceAdvisors.add(carl);
        computingScienceAdvisors.add(doug);
        advisorDB.put("BSc Hons Computing Science", computingScienceAdvisors);
    }

    private void initializeDemoAppointments()
    {
        Advisor demoAdvisor = advisorDB.get("BSc Hons Computing Science").get(0);
        blockUnblockTimeslots(true, demoAdvisor, 17, 9, 23, 16);

        String demoStudentProgram = "BSc Hons Computing Science";

        int demoStudent1Number = 1;
        String demoStudent1Name = "Demo Student 1";
        Timeslot demoStudent1Timeslot1 = new Timeslot(11, 6, 12, 2023, false);
        Timeslot demoStudent1Timeslot2 = new Timeslot(14, 14, 12, 2023, false);
        int demoStudent2Number = 2;
        String demoStudent2Name = "Demo Student 2";
        Timeslot demoStudent2Timeslot1 = new Timeslot(15, 5, 12, 2023, false);
        Timeslot demoStudent2Timeslot2 = new Timeslot(9, 13, 12, 2023, false);
        int demoStudent3Number = 3;
        String demoStudent3Name = "Demo Student 3";
        Timeslot demoStudent3Timeslot1 = new Timeslot(11, 13, 12, 2023, false);


        Appointment demoStudent1appointment1 = new Appointment(demoStudent1Number, demoStudent1Name, demoStudentProgram, "I need help with my CV.", demoAdvisor, demoStudent1Timeslot1);
        Appointment demoStudent1appointment2 = new Appointment(demoStudent1Number, demoStudent1Name, demoStudentProgram, "I need help with my dissertation.", demoAdvisor, demoStudent1Timeslot2);
        Appointment demoStudent2appointment1 = new Appointment(demoStudent2Number, demoStudent2Name, demoStudentProgram, "I need help implementing a service.", demoAdvisor, demoStudent2Timeslot1);
        Appointment demoStudent2appointment2 = new Appointment(demoStudent2Number, demoStudent2Name, demoStudentProgram, "I need help with a bug in my program.", demoAdvisor, demoStudent2Timeslot2);
        Appointment demoStudent3appointment1 = new Appointment(demoStudent3Number, demoStudent3Name, demoStudentProgram, "I need help with my personal statement.", demoAdvisor, demoStudent3Timeslot1);
        bookAppointment(demoStudent1appointment1);
        bookAppointment(demoStudent1appointment2);
        bookAppointment(demoStudent2appointment1);
        bookAppointment(demoStudent2appointment2);
        bookAppointment(demoStudent3appointment1);
    }
    
}
