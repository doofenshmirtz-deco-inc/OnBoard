/**
 * Displays a study room with buttons to join.
 */

import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import {
  Popover,
  Button,
  ListItemIcon,
  ListItemText,
  ListItem,
  Typography,
  Grid,
} from "@material-ui/core";

interface Props {
  name: string;
  handleClickOpen: Function;
  roomSize: number;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
    },
    joinButton: {
      [theme.breakpoints.up("md")]: {
        textAlign: "center",
      },
    },
    icon: {
      color: theme.palette.primary.main,
    },
    grid: {
      display: "flex",
      alignItems: "center",
    },
  })
);

export default function StudyRoomButton(props: Props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setAnchorEl(null);
    props.handleClickOpen();
  };

  return (
    <ListItem alignItems="center" divider={true} className={classes.root}>
      <Grid container>
        <Grid item xs={12} md={10} className={classes.grid}>
          <ListItemIcon className={classes.icon}>
            <PersonIcon />
            {props.roomSize}
          </ListItemIcon>
          <ListItemText primary={props.name} />
        </Grid>
        <Grid item xs={12} md={2} className={classes.joinButton}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleClick}
            size="large"
          >
            Join
          </Button>
        </Grid>
        <Popover
          style={{
            textAlign: "center",
          }}
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          Join This Meeting?
          <Typography>
            <Button
              variant="outlined"
              color="primary"
              style={{
                margin: "0.5em",
                padding: "0.25em",
                textTransform: "none",
              }}
              onClick={handleOpen}
            >
              Yes
            </Button>
            <Button
              variant="outlined"
              style={{ color: "red", margin: "0.5em", border: "1px solid red" }}
              onClick={handleClose}
            >
              No
            </Button>
          </Typography>
        </Popover>
      </Grid>
    </ListItem>
  );
}
