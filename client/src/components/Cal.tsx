import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import React, { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CardContent from "@material-ui/core/CardContent";
import Box from "@material-ui/core/Box";
import { useQuery, gql } from "@apollo/client";
import {
  MyCalendar,
  MyCalendar_me_groups_ClassGroup,
} from "../graphql/MyCalendar";
import { MyColours } from "../graphql/MyColours";
import { useHistory } from "react-router";

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

const GET_COLOURS = gql`
  query MyColours {
    me {
      courses {
        colour
        course {
          code
        }
      }
    }
  }
`;

const defaultProps = {
  bgcolor: "background.paper",
  m: 1,
  borderColor: "text.primary",
};

export default function MyCal() {
  const { data } = useQuery<MyCalendar>(GET_CALENDAR);
  const { data: courses } = useQuery<MyColours>(GET_COLOURS);
  const [myTimetable, setMyTimetable] = useState([] as any[]);

  const history = useHistory();

  useEffect(() => {
    let calendar = data?.me?.groups?.filter(
      (e) => e.__typename == "ClassGroup"
    ) as MyCalendar_me_groups_ClassGroup[] | null;

    // Get necessary data for calendar from ClassGroup data from Apollo
    let timetable = calendar?.map((e) => [
      e?.times,
      e?.duration,
      e?.name,
      e?.type,
      e?.id,
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
          id: e[4],
        })
      );
    });

    setMyTimetable(events);
  }, [data]);

  return (
    <Box border={1}>
      <CardContent>
        <Calendar
          localizer={localizer}
          events={myTimetable}
          scrollToTime={new Date()}
          startAccessor="start"
          defaultView={"work_week"}
          views={["month", "work_week"]}
          endAccessor="end"
          style={{ height: 446 }}
          onSelectEvent={(event) => {
            history.push("/study-rooms/video/" + event.id);
          }}
          eventPropGetter={(event) => {
            // Create list of mappings from code to colour
            const colors = courses?.me?.courses.map((e) => [
              e?.course?.code,
              e?.colour,
            ]);
            // Get colour from list of course colours
            const color =
              colors?.filter((e) => event?.title.indexOf(e[0]) !== -1)[0] !==
              undefined
                ? colors?.filter((e) => event?.title.indexOf(e[0]) !== -1)[0][1]
                : "#666666";
            // Apply styles based on colour
            let newStyle = {
              backgroundColor: color,
              color: "white",
              borderRadius: "0px",
              border: "none",
              fontSize: "0.8em",
            };
            return {
              className: "",
              style: newStyle,
            };
          }}
          popup
        />
      </CardContent>
    </Box>
  );
}
