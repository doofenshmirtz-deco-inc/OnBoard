import React, { useState } from "react";
import { makeStyles, Theme } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import openRooms from '../../components/openRooms.json'
import StudyRoom from "../../components/StudyRoom";
import { Grid } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column",
    },
    searchBar : {
      width: "75%",
      fontSize: "1.75rem",
      alignContent: "center",
    }
  }));
  const classes = useStyles();

  return (
    <List className={classes.root}>
      <TextField
        id="contacts-search"
        style={{fontSize: "1.2rem", marginBottom: "1em"}}
        label="Search For Open Meeting Rooms"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={classes.searchBar}
        />
      {Object.values(openRooms).map((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ? (
          <StudyRoom room={item}/>
        ) : null
      )}
    </List>
  );
};

export default Explore;