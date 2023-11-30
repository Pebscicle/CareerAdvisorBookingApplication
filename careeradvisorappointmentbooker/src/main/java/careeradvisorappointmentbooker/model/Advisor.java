package careeradvisorappointmentbooker.model;

import java.util.List;

public class Advisor {
    
    private String name;
    public String getName(){return name;}

    private String degreeProgram;
    public String getDegreeProgram(){return degreeProgram;}

    private List<Timeslot> timeslots;
    public List<Timeslot> getTimeslots(){return timeslots;}

    //Not the correct way of doing the password. Temporary:
    private String password;
    public String getPassword(){return password;}

    private String advisorID;
    public String getAdvisorID(){return advisorID;};

    /**
     * 
     */
    public Advisor(String n, String spec, List<Timeslot> slots)
    {
        this.name = n;
        this.degreeProgram = spec;
        this.timeslots = slots;

        this.advisorID = degreeProgram+"-"+name;

        this.password = "123";
    }

    /**
     * 
     * @param timeslot timeslot that will update an exisiting timeslot
     */
    public void updateTimeslot(Timeslot timeslot)
    {
        for(int i = 0; i < timeslots.size(); i++)
        {
            if(timeslots.get(i).equals(timeslot))
            {
                timeslots.set(i, timeslot);
            }
        }
    }

    @Override
    public String toString()
    {
        return name + " a career advisor for " + degreeProgram;
    }
    

}
