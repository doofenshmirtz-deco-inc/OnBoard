import React, { Fragment } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Announcements from "./Announcements";
import { Link, useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { GetClassInfo } from "../graphql/GetClassInfo";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
  },
  tabs: {
    textTransform: "none",
  },
}));

let menuBarComponents: string[] = [
  "Announcements",
  "Learning Resources",
  "Assessment",
  "Course Staff",
  "Course Profile (ECP)",
];

const COURSE_INFO = gql`
  query GetClassInfo {
    me {
      courses {
        course {
          id
          name
          code
          year
          semester
        }
      }
    }
  }
`;

export default function ClassView() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  let { classId } = useParams();

  const { loading, error, data } = useQuery<GetClassInfo>(COURSE_INFO);

  let courseData = null;
  if (!data || !data.me) {
  } else {
    courseData = data.me.courses.find(
      (element) => element.course.id == classId
    );
  }

  return !courseData ? (
    <div>Class was not found</div>
  ) : (
    <div className={classes.root}>
      <h1>
        {courseData.course.code}: {courseData.course.name}
      </h1>
      <h2>
        Semester {courseData.course.semester} {courseData.course.year}
      </h2>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {menuBarComponents.map((item, index) => {
            return (
              <Tab
                key={index}
                className={classes.tabs}
                label={item}
                {...a11yProps(index)}
              />
            );
          })}
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Announcements isDashboard={false} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        Item Three
      </TabPanel>
      <TabPanel value={value} index={3}>
        Item Four
      </TabPanel>
      <TabPanel value={value} index={4}>
        Item Five
      </TabPanel>
    </div>
  );
}
