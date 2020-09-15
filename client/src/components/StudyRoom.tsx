import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import PersonIcon from '@material-ui/icons/Person';
import {Popover, Button, ListItemIcon, ListItemText, ListItem, Typography} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "10vh",
    },
    itemText: {
      fontSize: "1.2rem"
    },
    joinButton: {
      height: "85%",
      width: "20%",
      borderRadius: "0px"
    },

  }),
);

export default function StudyRoom(props: any) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ListItem alignItems="center" divider={true} className={classes.root}>
      <ListItemIcon style={{"color":"red"}}>
        <PersonIcon/>
        {props.room.roomSize}
      </ListItemIcon>
      <ListItemText
        className={classes.itemText}
        primary={props.room.title}
      />
      <Button variant="contained" color="primary" onClick={handleClick} className={classes.joinButton}>
        Join
      </Button>
      <Popover
        style={{"textAlign":"center"}} 
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        Join This Meeting?
        <Typography>
          <Button variant="contained" style={{"color":"green"}} onClick={() => (alert("entering the meeting room // TODO!!"))}> 
            Yes
          </Button>
          <Button variant="contained" style={{"color":"red"}} onClick={handleClose}>
            No
          </Button>
        </Typography>
      </Popover>
    </ListItem>
  );
}
