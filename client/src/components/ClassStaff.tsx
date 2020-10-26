import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
} from "@material-ui/core";
import { gql, useQuery } from "@apollo/client";
import { CourseStaff, CourseStaff_course_staff } from "../graphql/CourseStaff";
import { GetClassInfo_me_courses_course_staff } from "../graphql/GetClassInfo";

export default (props: { staff: GetClassInfo_me_courses_course_staff[] }) => {
  return (
    <List>
      {props.staff.map((i) => (
        <ListItem key={i.name}>
          <ListItemAvatar>
            <Avatar src={i.avatar} />
          </ListItemAvatar>
          <ListItemText primary={i.name} />
        </ListItem>
      ))}
    </List>
  );
};
