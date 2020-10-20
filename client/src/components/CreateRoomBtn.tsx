import React, { useState, ChangeEvent } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Input,
  InputLabel,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { AddStudyGroup } from "../graphql/AddStudyGroup";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import { useHistory } from "react-router";
import { GetMyId } from "../graphql/GetMyId";
import { LoadingPage } from "./LoadingPage";

const addStudyGroup = gql`
  mutation AddStudyGroup(
    $uids: [String!]!
    $isPublic: Boolean!
    $groupName: String!
  ) {
    addStudyGroup(uids: $uids, isPublic: $isPublic, groupName: $groupName) {
      id
    }
  }
`;

const meId = gql`
  query GetMyId {
    me {
      id
    }
  }
`;

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(1),
    width: "16%",
    textTransform: "none",
  },
  inline: {
    display: "inline",
  },
  margins: {
    marginTop: "1em",
  },
  full: {
    width: "100%",
  },
  big: {
    minWidth: "40%",
  },
}));

// TODO: PopUp props type definition
const PopUp = (props: any) => {
  const [open, setOpen] = useState(false);
  const [studyRoomName, setRoomName] = useState("");
  const [selectedContacts, setSelectedContacts] = useState([] as any[]);
  const [isPublic, setIsPublic] = useState(false);
  const [groupID, setGroupID] = useState("");

  const [createStudyRoom, { data, loading }] = useMutation<AddStudyGroup>(
    addStudyGroup
  );

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const uidData = useQuery<GetMyId>(meId);
  const history = useHistory();
  const classes = useStyles();

  if (!uidData.data || !uidData.data.me) {
    return <LoadingPage />;
  }
  const uid = uidData.data.me.id;

  const handleCreate = () => {
    let uids = selectedContacts.map(
      (c: any) => c.users.filter((user: any) => user.id !== uid)[0].id
    );
    uids.push(uid);
    console.log(uids);
    console.log(selectedContacts);
    createStudyRoom({
      variables: { uids: uids, groupName: studyRoomName, isPublic: isPublic },
    });
    while (loading) {
      console.log("hello");
    }
    // TODO: get data to work
    setGroupID(data ? (data.addStudyGroup ? data.addStudyGroup.id : "") : "");
    window.location.href = "/study-rooms/recents/" + groupID;
    handleClose();
  };

  return (
    <div className={classes.inline}>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        startIcon={props.explore ? <AddIcon /> : null}
        onClick={handleClickOpen}
        style={{ width: props.explore ? "16%" : "23%" }}
      >
        {props.explore ? "Create Study Room" : <GroupAddIcon />}
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        classes={{ paperWidthSm: classes.big }}
      >
        <DialogTitle id="form-dialog-title">Create Study Room</DialogTitle>
        <DialogContent>
          <FormControl className={classes.full}>
            <InputLabel htmlFor="study-room-name">Study Room Name</InputLabel>
            <Input
              id="study-room-name"
              aria-describedby="my-helper-text"
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Autocomplete
              className={classes.margins}
              multiple
              id="tags-outlined"
              options={props.contacts}
              getOptionLabel={(option: any) => option.name}
              filterSelectedOptions
              onChange={(e: any, newValue: any | null) => {
                setSelectedContacts(newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Add Contacts to Study Room"
                  placeholder="Add Contacts"
                />
              )}
            />
            <FormControlLabel
              value="start"
              control={
                <Checkbox
                  checked={isPublic}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setIsPublic(e.target.checked);
                  }}
                  name="isPublic"
                  color="primary"
                />
              }
              label="Public"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleCreate} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PopUp;
