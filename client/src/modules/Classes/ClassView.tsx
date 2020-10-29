import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Announcements from "../../components/Announcements";
import { useQuery, useMutation, gql } from "@apollo/client";
import {
  GetClassInfo,
  GetClassInfo_me_courses_course_staff,
} from "../../graphql/GetClassInfo";
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
import { GetCoursePermissions } from "../../graphql/GetCoursePermissions";
import ClassStaff from "./ClassStaff";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { addAnnouncement } from "../../graphql/addAnnouncement";

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
  addButton: {
    float: "right",
    display: "block",
  },
}));

let tabPages = (staff: GetClassInfo_me_courses_course_staff[]) => {
  return [
    {
      name: "Announcements",
      path: "announcements/",
      content: <AnnouncementPage />,
    },
    {
      name: "Learning Resources",
      path: "resources/",
      content: <ResourceFolder assessmentPage={false} />,
    },
    {
      name: "Assessment",
      path: "assessment/",
      content: <ResourceFolder assessmentPage={true} />,
    },
    {
      name: "Course Staff",
      path: "staff/",
      content: <ClassStaff staff={staff} />,
    },
  ];
};

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
          staff {
            name
            avatar
          }
        }
      }
    }
  }
`;

const COURSE_PERMISSIONS = gql`
  query GetCoursePermissions {
    me {
      coursesCoordinator: courses(role: Coordinator) {
        course {
          id
        }
      }
      coursesTutor: courses(role: Tutor) {
        course {
          id
        }
      }
      coursesStudent: courses(role: Student) {
        course {
          id
        }
      }
    }
  }
`;

const ADD_ANNOUNCEMENT = gql`
  mutation addAnnouncement($courseID: ID!, $title: String!, $html: String!) {
    addAnnouncement(data: { courseID: $courseID, title: $title, html: $html }) {
      id
    }
  }
`;

function CreateAnnouncement(props: { courseId?: string }) {
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");

  const [addAnnouncement] = useMutation<addAnnouncement>(ADD_ANNOUNCEMENT, {
    update(cache) {
      cache.reset();
    },
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    addAnnouncement({
      variables: {
        courseID: props.courseId,
        title: title,
        html: content,
      },
    });

    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="New Annocunement">
        <IconButton className={classes.addButton} aria-label="add">
          <AddIcon fontSize="small" onClick={handleClickOpen} />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle id="form-dialog-title">New announcement</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            id="title"
            label="Title"
            fullWidth
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            autoFocus
            id="content"
            label="Content"
            fullWidth
            multiline
            rows={12}
            onChange={(e) => setContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function AnnouncementPage(props: { courseId?: string; editable?: boolean }) {
  return (
    <>
      {props.editable && <CreateAnnouncement {...props} />}
      <Announcements
        isDashboard={false}
        courseId={props.courseId}
        deletable={props.editable}
      />
    </>
  );
}

export default function ClassView() {
  const classes = useStyles();

  let { classId: courseId } = useParams<ClassViewProps>();

  let { url } = useRouteMatch();
  let location = useLocation();

  const { loading, data } = useQuery<GetClassInfo>(COURSE_INFO);

  const { data: userPermissions } = useQuery<GetCoursePermissions>(
    COURSE_PERMISSIONS
  );

  let courseData = data?.me?.courses.find(
    (element) => element.course.id === courseId
  );

  let userEdit = false;
  if (
    userPermissions?.me?.coursesCoordinator.find(
      (element) => element.course.id === courseId
    ) ||
    userPermissions?.me?.coursesTutor.find(
      (element) => element.course.id === courseId
    )
  ) {
    userEdit = true;
  }

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
          {tabPages(courseData.course.staff).map((item, index) => {
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
        {tabPages(courseData.course.staff).map((item, index) => {
          return (
            <Route
              key={index}
              path={`${url}/${item.path}`}
              render={() => (
                <TabPanel index={index}>
                  {React.cloneElement(item.content, {
                    courseId: courseId,
                    editable: userEdit,
                  })}
                </TabPanel>
              )}
            />
          );
        })}
        <Route path="/">
          <Redirect
            to={`${url}/${tabPages(courseData.course.staff)[0].path}`}
          />
        </Route>
      </Switch>
    </div>
  );
}
