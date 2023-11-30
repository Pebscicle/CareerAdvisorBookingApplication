package careeradvisorappointmentbooker.model;

public class Timeslot {
    
    private int startHour;
    public int getStartHour(){return startHour;}
    private int day;
    public int getDay(){return day;}
    private int month;
    public int getMonth(){return month;}
    private int year;
    public int getYear(){return year;}

    private boolean timeslotAvailable;
    public boolean isTimeslotAvailable(){return timeslotAvailable;}
    public void setTimeslotAvailability(boolean availability){this.timeslotAvailable = availability;}

    private String appointmentID;
    public void setAppointmentID(String id){this.appointmentID = id;}

    /**
     * 
     */
    public Timeslot(int h, int d, int m, int y, boolean avail)
    {
        this.startHour = h;
        this.day = d;
        this.month = m;
        this.year = y;
        this.timeslotAvailable = avail;
    }

    @Override
    public String toString()
    {
        return (startHour+"h"+day+"/"+month+"/"+year);
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
        Timeslot other = (Timeslot) obj;
        return startHour == other.startHour && day == other.day && month == other.month && year == other.year;    
    }


}
