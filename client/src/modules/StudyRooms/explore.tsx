import React, { useState } from "react";
import { makeStyles, Theme } from '@material-ui/core/styles';
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import StudyRoomButton from "../../components/StudyRoomButton";
import SearchIcon from '@material-ui/icons/Search';
import InputAdornment from '@material-ui/core/InputAdornment';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';


const Explore = (props: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      display: "flex",
      flexDirection: "column",
    },
    searchBar : {
      width: "70%",
      fontSize: "1.75rem",
      alignContent: "center",
      marginRight: "10%"
    },
    button: {
      margin: theme.spacing(1),
      width: "16%"
    },
  }));
  const classes = useStyles();
  var addButton:any = useState;
  if (props.exploreTab) {
    addButton = (
      <Button
      variant="contained"
      color="secondary"
      className={classes.button}
      startIcon={<AddIcon/>}
      >
        Create Study Room
      </Button>
    );
  }

  return (
    <List className={classes.root}>
      <div>
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
            ),
          }}
          />
          {addButton}
      </div>

      {(props.openRooms).map((item:any) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ? (
          <StudyRoomButton room={item}/>
        ) : null
      )}
    </List>
  );
};

export default Explore;