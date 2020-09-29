import React from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog, { DialogProps } from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "10vh",
    },
    footer: {
      display: "flex",
      borderTop: "1px solid grey",
      width: "75%",
    },
    messaging: {
      height: "100%",
      width: "25%",
      backgroundColor: "red",
      position: "absolute",
      right: "0",
    },
  })
);

const MeetingRoom = (props: any) => {
  const classes = useStyles();
  return (
    <Dialog
      open={props.open} //true
      onClose={props.handleClose}
      aria-labelledby="form-dialog-title"
      fullScreen={true}
      maxWidth={"xl"}
    >
      <DialogContent className={classes.messaging}>
        Hello messaging stuff
      </DialogContent>

      <DialogContent />

      <div className={classes.footer}>
        <DialogTitle id="form-dialog-title" style={{ flex: "1" }}>
          {props.title}
        </DialogTitle>
        <Button
          onClick={props.handleClose}
          color="primary"
          style={{
            color: "red",
            justifyContent: "flex-end",
            marginRight: "10px",
          }}
        >
          Leave
        </Button>
      </div>
    </Dialog>
  );
};

export default MeetingRoom;
