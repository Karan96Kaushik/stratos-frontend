import React, {useEffect, useState, createRef} from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import CalendarDialog from 'src/components/CalendarDialog';
import EventViewDialog from 'src/components/EventViewDialog';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField } from '@material-ui/core';

import "../styles.css";

const MyCalendar = (props) => {
  
  const [popup, setPopup] = useState(null)
  const [search, setSearch] = useState('')
  let events = props.events ?? []

  if (search.length)
    events = props.events.filter(e => 
      e.title?.toLowerCase().includes(search.toLowerCase()) || 
      e.data.remarks?.toLowerCase().includes(search.toLowerCase()) || 
      e.data.court?.toLowerCase().includes(search.toLowerCase()) 
    )

  const calendarRef = createRef()

  function clickListener (e) {
    let taskID = e.target.innerText
    let date = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-date')
    if (!date) {
      date = e.target.parentElement.parentElement.parentElement.parentElement.getAttribute('data-date')
    }
    let event = events.find(e => e.title.replace(/ /g, '') == taskID.replace(/ /g, '') && e.date == date)

    if (!event) event = events.find(e => e.title.replace(/ /g, '') == taskID.replace(/ /g, ''))
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
  }, [props.events, search])

  return (
    <div className="Cal">
      <FullCalendar
        defaultView="dayGridMonth"
        initialDate={new Date()}
        plugins={[dayGridPlugin]}
        events={events}
        ref={calendarRef}
      />
      <br />
      <TextField
        fullWidth
        label="Search"
        id="text"
        value={search}
        onChange={({target}) => setSearch(target.value)}
        variant="standard"
      />
      <br />
      <br />
      <CalendarDialog setEvents={props.setEvents} events={events} />
      <br />
      <EventViewDialog event={popup} setEvent={setPopup} allEvents={props.events} setAllEvents={props.setEvents} />
    </div>
  );
}

export default MyCalendar