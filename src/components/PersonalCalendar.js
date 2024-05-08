import React, {useEffect, useState, createRef} from 'react';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import CalendarDialog from 'src/components/CalendarDialog';
import EventViewDialog from 'src/components/EventViewDialog';
import { useNavigate, useLocation } from 'react-router-dom';
import { TextField } from '@material-ui/core';

import "../styles.css";

const MyCalendar = (props) => {
  
	const [open, setOpen] = useState(false)
  const [popup, setPopup] = useState(null)
  const [editEvent, setEditEvent] = useState(null)
  const [search, setSearch] = useState('')
  let events = props.events ?? []

  if (search.length)
    events = props.events.filter(e => 
      e.salesID?.toLowerCase().includes(search.toLowerCase()) || 
      e.promoterName?.toLowerCase().includes(search.toLowerCase()) || 
      e.projectName?.toLowerCase().includes(search.toLowerCase()) || 
      e.data.exClientID?.toLowerCase().includes(search.toLowerCase()) 
    )

  const calendarRef = createRef()

  function clickListener (e) {
    let taskID = e.target.innerText
    // console.debug(e.target)
    let date = e.target.parentElement?.parentElement?.parentElement?.parentElement?.getAttribute('data-date')
    if (!date) {
      date = e.target?.parentElement?.parentElement?.parentElement?.parentElement?.getAttribute('data-date')
    }
    if (!date) {
      return
    }
    let event = events.find(e => e.title.replace(/ /g, '').trim() == salesID.replace(/ /g, '').trim() && e.date == date)
    // console.log(events.map(e => e.title.replace(/ /g, '').trim()), salesID.replace(/ /g, '').trim())
    if (!event) event = events.find(e => e.title.replace(/ /g, '').trim() == salesID.replace(/ /g, '').trim())
    if (!event) return
    
    setPopup(event?.data)
  }

  useEffect(() => {
    setTimeout(() => {
      let eventsEls = document.getElementsByClassName('fc-daygrid-event')
      // console.debug("EV EL", eventsEls.length)
      if (eventsEls.length)
        for (let i = 0; i < eventsEls.length; i++) {
          eventsEls[i].removeEventListener('click', clickListener)
          eventsEls[i].removeEventListener('click', clickListener)
          eventsEls[i].addEventListener('click', clickListener)
        }

    }, 0)
  }, [events, search])

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
      <CalendarDialog 
        setOpen={setOpen} open={open}
        setEvents={props.setEvents} events={events} 
        editEvent={editEvent} setEditEvent={setEditEvent} 
      />
      <br />
      <EventViewDialog 
        event={popup} setEvent={setPopup} 
        setEditEvent={setEditEvent} 
        allEvents={props.events} setAllEvents={props.setEvents} 
        setEditOpen={setOpen}
      />
    </div>
  );
}

export default MyCalendar