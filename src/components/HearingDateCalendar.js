import React, {useEffect, useState} from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import "../styles.css";

const MyCalendar = (props) => {

    const events = [{ title: "AB00212", date: ('2022-05-05'), interactive:true, url:'google.com' }];

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