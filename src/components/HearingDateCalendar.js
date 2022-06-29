import React, {useEffect, useState} from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import CalendarDialog from 'src/components/CalendarDialog';
import EventViewDialog from 'src/components/EventViewDialog';
import { useNavigate, useLocation } from 'react-router-dom';

import "../styles.css";

const MyCalendar = (props) => {
  
  const [popup, setPopup] = useState(null)
  const events = props.events ?? []
  
  function clickListener (e) {
    let taskID = e.target.innerText
    let date = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-date')
    if (!date) {
      date = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-date')
    }
    let event = props.events.find(e => e.title == taskID && e.date == date)
    if (!event) event = props.events.find(e => e.title == taskID)
    if (!event) return
    setPopup(event?.data)
  }

  useEffect(() => {
    setTimeout(() => {
      let eventsEls = document.getElementsByClassName('fc-daygrid-event')

      if (eventsEls.length)
        for (let i = 0; i < eventsEls.length; i++) {
          eventsEls[i].removeEventListener('click', clickListener)
          eventsEls[i].removeEventListener('click', clickListener)
          eventsEls[i].addEventListener('click', clickListener)
        }

    }, 0)
  }, [props.events])

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
      <br />
      <EventViewDialog event={popup} setEvent={setPopup} />
    </div>
  );
}

export default MyCalendar