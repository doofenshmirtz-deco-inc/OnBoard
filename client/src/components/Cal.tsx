import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment)

const myEventsList = {
    events: [
      {
        start: moment().toDate(),
        end: moment()
          .add(1, "days")
          .toDate(),
        title: "Some title"
      }
    ]
  };

const MyCalendar = () => (
  <div>
    <Calendar
      localizer={localizer}
      events={myEventsList.events}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 500 }}
    />
  </div>
)

export default MyCalendar;