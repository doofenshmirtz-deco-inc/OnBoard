import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";

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

export default function MyCalendar() {
  return (
    <Box border={1}>
      <CardContent>
        <Calendar
          localizer={localizer}
          events={myEventsList.events}
          startAccessor="start"
          defaultView={"week"}
          views={["month", "week"]}
          endAccessor="end"
          style={{ height: 446 }}
        />
      </CardContent>
    </Box>
  );
}
