import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import classes from "*.module.css";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { useQuery, gql } from "@apollo/client";

const localizer = momentLocalizer(moment);

const GET_TIMETABLE = gql`
  query MyClasses {
    me {
      courseColors {
        colour
        course {
          name
          code
        }
      }
    }
  }
`;

const myEventsList = {
  events: [
    {
      start: moment().toDate(),
      end: moment().add(1, "days").toDate(),
      title: "Some title",
    },
  ],
};

const defaultProps = {
  bgcolor: "background.paper",
  m: 1,
  borderColor: "text.primary",
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
          eventPropGetter={
            (event, start, end, isSelected) => {
              let newStyle = {
                backgroundColor: "#6B2BC6",
                color: 'white',
                borderRadius: "0px",
                border: "none"
              };
        
              return {
                className: "",
                style: newStyle
              };
            }
          }
        />
      </CardContent>
    </Box>
  );
}
