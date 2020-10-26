import React, { ChangeEvent, useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import StudyRoomButton from "../../components/StudyRoomButton";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import { gql, useQuery, useMutation } from "@apollo/client";
import { StudyRooms, StudyRooms_studyRooms } from "../../graphql/StudyRooms";
import { LoadingPage } from "../../components/LoadingPage";
import { Classes, Classes_me_groups_ClassGroup } from "../../graphql/Classes";
import {
  JoinStudyGroup,
  JoinStudyGroupVariables,
} from "../../graphql/JoinStudyGroup";
import { useHistory } from "react-router";
import { Contacts } from "../../graphql/Contacts";
import CreateRoomBtn from "../../components/CreateRoomBtn";

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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
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

  if (!rooms || (props.isExplore && (!contactsData || !contactsData.data)))
    return <LoadingPage />;

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
          <CreateRoomBtn
            contacts={contactsData.data?.me?.groups.filter(
              (c: any) => c.__typename === "DMGroup"
            )}
            explore
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
