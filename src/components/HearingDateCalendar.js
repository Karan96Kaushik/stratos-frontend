import React, {useEffect, useState} from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import CalendarDialog from 'src/components/CalendarDialog';

import "../styles.css";

const MyCalendar = (props) => {

    const events = props.events ?? []

    return (
      <div className="Cal">
        <FullCalendar
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin]}
          events={events}
        />
        <br />
        <CalendarDialog setEvents={props.setEvents} events={events} />
        <br />
        <CalendarDialog setEvents={props.setEvents} events={events} isDelete='true' />
      </div>
    );
}

export default MyCalendar