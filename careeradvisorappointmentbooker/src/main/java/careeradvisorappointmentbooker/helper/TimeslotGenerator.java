package careeradvisorappointmentbooker.helper;

import java.util.ArrayList;
import java.util.List;

import careeradvisorappointmentbooker.model.Timeslot;

public class TimeslotGenerator {
    
    static final int[] HOURS = {9, 10, 11, 12, 13, 14, 15, 16};
    static final int[] DAYS = {3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23};
    static final int MONTH = 12;
    static final int YEAR = 2023;

    public TimeslotGenerator()
    {

    }

    public static List<Timeslot> generateTimeslots()
    {
        List<Timeslot> timeslotsToReturn = new ArrayList<Timeslot>();

        for(int d = 0; d < DAYS.length; d++)
        {
            boolean isAvail = true;
            if(DAYS[d] == 3 || DAYS[d] == 9 || DAYS[d] == 10 || DAYS[d] == 16 || DAYS[d] == 17 || DAYS[d] == 23)
            {
                isAvail = false;
            }
            for(int h = 0; h < HOURS.length; h++)
            {
                timeslotsToReturn.add(new Timeslot(HOURS[h], DAYS[d], MONTH, YEAR, isAvail));
            }   
        }
        return timeslotsToReturn;
    }
    
}
