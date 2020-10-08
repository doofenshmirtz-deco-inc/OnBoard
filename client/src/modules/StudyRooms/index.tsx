import React from "react";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Recents from "./recents";
import Explore from "./explore";
import openRooms from "../../components/openRooms.json";
import classrooms from "../../components/classrooms.json";
import MeetingRoom from "../../components/MeetingRoom";

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StudyRooms = () => {
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      flexGrow: 1,
      color: theme.palette.primary.dark
    },
    tabs: {
      textTransform: "none",
      color: theme.palette.primary.dark,
    },
  }));

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const [open, setOpen] = React.useState(false);

  const [meetingName, setMeeting] = React.useState("");

  const handleClickOpen = (item: string) => {
    setMeeting(item);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="simple tabs example"
          variant="fullWidth"
        >
          <Tab className={classes.tabs} label="Recents" {...a11yProps(0)} />
          <Tab className={classes.tabs} label="Explore" {...a11yProps(1)} />
          <Tab className={classes.tabs} label="Classes" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <Recents />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Explore
          handleClose={handleClose}
          handleClickOpen={handleClickOpen}
          openRooms={openRooms}
          exploreTab={true}
          label={"Search For Open Meeting Rooms"}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Explore
          handleClose={handleClose}
          handleClickOpen={handleClickOpen}
          openRooms={classrooms}
          label={"Search For Class Meeting Rooms"}
        />
      </TabPanel>
      <MeetingRoom open={open} handleClose={handleClose} title={meetingName} />
    </div>
  );
};

export default {
  routeProps: {
    path: "/study-rooms",
    component: StudyRooms,
  },
  name: "Study Rooms",
  icon: MeetingRoomIcon,
};
