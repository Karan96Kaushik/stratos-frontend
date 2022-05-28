import React, {useEffect, useState} from 'react';
import "../styles.css";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";

const MyCalendar = (props) => {

    const events = [{ title: "today's event", date: new Date('2022-05-05T18:30:00.000Z') }];

    return (
      <div className="Cal">
        <FullCalendar
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin]}
          events={events}
        />
      </div>
    );
}

export default MyCalendar