import React, { ChangeEvent, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import StudyRoomButton from "../../components/StudyRoomButton";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { gql, useQuery, useMutation } from "@apollo/client";
import { StudyRooms, StudyRooms_studyRooms } from "../../graphql/StudyRooms";
import { LoadingPage } from "../../components/LoadingPage";
import { Classes, Classes_me_groups_ClassGroup } from "../../graphql/Classes";
import {
  JoinStudyGroup,
  JoinStudyGroupVariables,
} from "../../graphql/JoinStudyGroup";
import { useHistory } from "react-router";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Input,
  InputLabel,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete/Autocomplete";
import { Contacts } from "../../graphql/Contacts";
import { AddStudyGroup } from "../../graphql/AddStudyGroup";
import firebase from "firebase";

interface Props {
  isExplore: boolean;
}

const exploreQuery = gql`
  query StudyRooms {
    studyRooms {
      id
      name
      users {
        id
      }
    }
  }
`;

const classesQuery = gql`
  query Classes {
    me {
      groups {
        ... on ClassGroup {
          id
          name
          users {
            id
          }
        }
      }
    }
  }
`;

// TODO: use avatar & stuff as well?
const contactsQuery = gql`
  query Contacts {
    me {
      groups {
        ... on DMGroup {
          id
          name
          users {
            id
          }
        }
      }
    }
  }
`;

const joinStudyGroupMutation = gql`
  mutation JoinStudyGroup($id: ID!) {
    joinStudyGroup(groupID: $id) {
      id
    }
  }
`;

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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    display: "flex",
    flexDirection: "column",
  },
  searchBar: {
    width: "70%",
    fontSize: "1.75rem",
    alignContent: "center",
    marginRight: "10%",
    marginLeft: 15,
  },
  button: {
    margin: theme.spacing(1),
    width: "16%",
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

  const [createStudyRoom, { data }] = useMutation(addStudyGroup);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const uid = firebase.auth().currentUser?.uid;

  const handleCreate = () => {
    let uids = selectedContacts.map((c: any) => c.users.slice(-1)[0].id);
    uids.push(uid);
    createStudyRoom({
      variables: { uids: uids, groupName: studyRoomName, isPublic: isPublic },
    });
    handleClose();
  };

  const classes = useStyles();

  return (
    <div className={classes.inline}>
      <Button
        variant="contained"
        color="secondary"
        className={classes.button}
        startIcon={<AddIcon />}
        onClick={handleClickOpen}
      >
        Create Study Room
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

const Explore = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const classes = useStyles();

  const expData = useQuery<StudyRooms>(exploreQuery, {
    skip: !props.isExplore,
  });

  const classData = useQuery<Classes>(classesQuery, {
    skip: props.isExplore,
  });

  const contactsData = useQuery<Contacts>(contactsQuery, {
    skip: !props.isExplore,
  });

  const history = useHistory();

  const [expJoinMutation] = useMutation<
    JoinStudyGroup,
    JoinStudyGroupVariables
  >(joinStudyGroupMutation, {
    onCompleted({ joinStudyGroup }) {
      history.push("/study-rooms/video/" + joinStudyGroup.id);
    },
  });

  const rooms = props.isExplore
    ? expData.data?.studyRooms?.filter(
        (item) => item.__typename === "StudyGroup"
      )
    : classData.data?.me?.groups.filter(
        (item) => item.__typename === "ClassGroup"
      );

  const handleCLick = (id: string) => {
    if (props.isExplore) {
      expJoinMutation({ variables: { id } });
    } else {
      history.push("/study-rooms/video/" + id);
    }
  };

  if (!rooms || !contactsData || !contactsData.data) return <LoadingPage />;

  return (
    <List className={classes.root}>
      <div>
        <TextField
          id="contacts-search"
          style={{ fontSize: "1.2rem", marginBottom: "1em" }}
          label={props.isExplore ? "Search Study Rooms" : "Search Classes"}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={classes.searchBar}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        {props.isExplore ? (
          <PopUp
            contacts={contactsData.data?.me?.groups.filter(
              (c: any) => c.__typename === "DMGroup"
            )}
          />
        ) : (
          <> </>
        )}
      </div>

      {(rooms as Array<
        Classes_me_groups_ClassGroup | StudyRooms_studyRooms
      >).map((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
          <StudyRoomButton
            handleClickOpen={() => handleCLick(item.id)}
            name={item.name}
            roomSize={item.users.length}
          />
        ) : null
      )}
    </List>
  );
};

export default Explore;
