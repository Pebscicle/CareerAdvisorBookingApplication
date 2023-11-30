package careeradvisorappointmentbooker.model;

public class Appointment {

    //Student Number to identify the attending student of an appointment
    private int studentNumber;
    public int getStudentNumber(){return studentNumber;}
    private String studentName;
    public String getStudentName(){return studentName;}
    private String studentDegreeProgram;
    public String getStudentDegreeProgram(){return studentDegreeProgram;}
    

    private Advisor advisor;
    public Advisor getAdvisor(){return advisor;}
    //Timeslot of the given appointment
    private Timeslot timeslot;
    public Timeslot getTimeslot(){return timeslot;}
    private String meetingComments;
    public String getMeetingComments(){return meetingComments;}

    //Composite key of studentnumber and timeslot
    //- Student Number cannot uniquely identify an appointment because students can have meetings at various time
    //- The time slot cannot uniquely identify an appointment because other meetings can happen at the same time
    //- Since a student can only have one meeting at a time
    //- It is an ideal composite primary key
    private String appointmentID; 
    public String getAppointmentID(){return appointmentID;}

        



    /**
     * Appointment Constructor
     */
    /*public Appointment()
    {
        studentNumber = -1;
        advisor = new Advisor("NOBODY", "NOTHING", null);
        timeslot = new Timeslot(-1, -1, -1, -1, false);

        String compositeIDString = studentNumber + timeslot.toString();
        appointmentID = Integer.parseInt(compositeIDString);
    }*/

    public Appointment(int studentNumber, String studentName, String studentDegreeProgram, String meetingComments, Advisor advisor, Timeslot timeslot) {
        
        this.studentNumber = studentNumber;
        this.studentName = studentName;
        this.studentDegreeProgram = studentDegreeProgram;

        this.meetingComments = meetingComments;

        this.appointmentID = ""+this.studentNumber+"-"+timeslot.toString()+"";

        timeslot.setAppointmentID(this.appointmentID);

        this.timeslot = timeslot;

        advisor.updateTimeslot(this.timeslot);

        this.advisor = advisor;
    }

    public Appointment(Appointment that)
    {
        this.studentNumber = that.studentNumber;
        this.studentName = that.studentName;
        this.studentDegreeProgram = that.studentDegreeProgram;

        this.meetingComments = that.meetingComments;

        this.appointmentID = ""+this.studentNumber+"-"+that.timeslot.toString()+"";

        timeslot.setAppointmentID(this.appointmentID);

        this.timeslot = that.timeslot;

        that.advisor.updateTimeslot(this.timeslot);

        this.advisor = that.advisor;
    }

    @Override
    public String toString() {
        return "Appointment with " + advisor.getName() + ", a career advisor specialized in "
        + advisor.getDegreeProgram() + ", and " + studentNumber + " at " + timeslot.getStartHour() + "h " + 
        timeslot.getDay() + "/" + timeslot.getMonth() + "/" + timeslot.getYear();
    }

    @Override
    public boolean equals(Object obj)
    {
        if (this == obj) 
        {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) 
        {
            return false;
        }
        Appointment appt = (Appointment) obj;
        String apptID = appt.getAppointmentID();

        return this.appointmentID.equals(apptID);    
    }
    
}
