import React, { useState } from "react";
import { makeStyles, Theme } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import StudyRoomButton from "../../components/StudyRoomButton";
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';

const Explore = (props: any) => {
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
        label={props.label}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={classes.searchBar}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon/>
            </InputAdornment>
          )}}
        />

      {(props.openRooms).map((item:any) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ? (
          <StudyRoomButton room={item}/>
        ) : null
      )}
    </List>
  );
};

export default Explore;