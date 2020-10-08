import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { useQuery, gql } from "@apollo/client";
import {
  MyCalendar,
  MyCalendar_me_groups_ClassGroup,
} from "../graphql/MyCalendar";

const localizer = momentLocalizer(moment);

const GET_CALENDAR = gql`
  query MyCalendar {
    me {
      groups {
        ... on ClassGroup {
          id
          name
          times
          duration
          type
        }
      }
    }
  }
`;

const defaultProps = {
  bgcolor: "theme.palette.background.paper",
  m: 1,
  borderColor: "text.primary",
};

export default function MyCal() {
  const { data } = useQuery<MyCalendar>(GET_CALENDAR);
  const [myTimetable, setMyTimetable] = useState([]);

  useEffect(() => {
    let calendar = data?.me?.groups?.filter(
      (e) => e.__typename == "ClassGroup"
    ) as MyCalendar_me_groups_ClassGroup[] | null;

    let timetable = calendar?.map((e) => [
      e?.times,
      e?.duration,
      e?.name,
      e?.type,
    ]);

    let events = [] as any[];

    timetable?.forEach((e) => {
      let times = e[0] as Array<String>;
      let duration = e[1];
      let title = e[2];
      let type = e[3];
      times?.forEach((f) =>
        events.push({
          start: moment(f as string).toDate(),
          end: moment(f as string)
            .add(duration as number, "minutes")
            .toDate(),
          title: `${type}: ${title}`,
        })
      );
    });

    setMyTimetable(events as never[]);
  }, [data]);

  return (
    <Box border={1}>
      <CardContent>
        <Calendar
          localizer={localizer}
          events={myTimetable}
          startAccessor="start"
          defaultView={"work_week"}
          views={["month", "work_week"]}
          endAccessor="end"
          style={{ height: 446 }}
          eventPropGetter={(event, start, end, isSelected) => {
            let newStyle = {
              backgroundColor: "theme.palette.background.paper",
              color: "white",
              borderRadius: "0px",
              border: "none",
            };

            return {
              className: "",
              style: newStyle,
            };
          }}
        />
      </CardContent>
    </Box>
  );
}
