import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

const localizer = momentLocalizer(moment);

const myEventsList = {
  events: [
    {
      start: moment().toDate(),
      end: moment().add(1, "days").toDate(),
      title: "Some title",
    },
  ],
};

const MyCalendar = () => (
  <Card>
    <CardContent>
    <h2>Calendar</h2>
    <Calendar
      localizer={localizer}
      events={myEventsList.events}
      startAccessor="start"
      defaultView={'week'}
      views={['month', 'week']}
      endAccessor="end"
      style={{ height: 300 }}
    />
    </CardContent>
  </Card>
);

export default MyCalendar;
