
import React, {useState} from 'react';

import './CalendarCell.css'

function CalendarCell({timeslotIndex, performAction, bgColor, content})
{
    //Callbacks
    const performActionCallback = () =>
    {
        performAction(timeslotIndex);
    }

    //Render JSX
    return <div className="calendar-cell" style=
    {{
        backgroundColor: bgColor
    }} onClick={() => performActionCallback()}>
    {content}
    </div>;
}


export default CalendarCell;