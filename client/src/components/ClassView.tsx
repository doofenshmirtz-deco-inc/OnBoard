import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Announcements from "./Announcements";
import { useQuery, gql } from "@apollo/client";
import { GetClassInfo } from "../graphql/GetClassInfo";
import CircularProgress from "@material-ui/core/CircularProgress";
import ResourceFolder from "./ResourceFolder";
import {
  Switch,
  Route,
  Link,
  Redirect,
  useRouteMatch,
  useLocation,
  useParams,
} from "react-router-dom";

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
}

interface ClassViewProps {
  classId: any;
}

interface MenuBarComponent {
  name: any;
  path: any;
  content: React.ReactElement;
}

function TabPanel(props: TabPanelProps) {
  const { children, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

function classNotFound() {
  return (
    <>
      <h1>Well, that didn't work</h1>
      <p>
        The class you were looking for was not found or you don't have access to
        view it.
      </p>
    </>
  );
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

let tabPages: MenuBarComponent[] = [
  {
    name: "Announcements",
    path: "announcements/",
    content: <Announcements isDashboard={false} />,
  },
  {
    name: "Learning Resources",
    path: "resources/",
    content: <ResourceFolder />,
  },
  { name: "Assessment", path: "assessment/", content: <p>Assessment</p> },
  { name: "Course Staff", path: "staff/", content: <p>Staff</p> },
  {
    name: "Course Profile (ECP)",
    path: "profile/",
    content: <p>Course Profile (ECP)</p>,
  },
];

const COURSE_INFO = gql`
  query GetClassInfo {
    me {
      courses {
        colour
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

  let { classId: courseId } = useParams<ClassViewProps>();

  let { url } = useRouteMatch();
  let location = useLocation();

  const { loading, data } = useQuery<GetClassInfo>(COURSE_INFO);

  let courseData = data?.me?.courses.find(
    (element) => element.course.id === courseId
  );

  return !courseData ? (
    loading ? (
      <CircularProgress />
    ) : (
      classNotFound()
    )
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
          value={location.pathname.split("/", 4).join("/").concat("/")}
          indicatorColor="secondary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
        >
          {tabPages.map((item, index) => {
            return (
              <Tab
                key={index}
                className={classes.tabs}
                label={item.name}
                value={`${url}/${item.path}`}
                component={Link}
                to={`${url}/${item.path}`}
                {...a11yProps(index)}
              />
            );
          })}
        </Tabs>
      </AppBar>
      <Switch>
        {tabPages.map((item, index) => {
          return (
            <Route
              key={index}
              path={`${url}/${item.path}`}
              render={() => (
                <TabPanel index={index}>
                  {React.cloneElement(item.content, { courseId: courseId })}
                </TabPanel>
              )}
            />
          );
        })}
        <Route path="/">
          <Redirect to={`${url}/${tabPages[0].path}`} />
        </Route>
      </Switch>
    </div>
  );
}
