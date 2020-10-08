import React, { useState } from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import TextField from "@material-ui/core/TextField";
import StudyRoomButton from "../../components/StudyRoomButton";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import AddIcon from "@material-ui/icons/Add";
import Button from "@material-ui/core/Button";
import { gql, useQuery } from "@apollo/client";
import {
  StudyRooms,
  StudyRooms_userGroups_StudyGroup,
} from "../../graphql/StudyRooms";
import { LoadingPage } from "../../components/LoadingPage";
import { Classes, Classes_me_groups_ClassGroup } from "../../graphql/Classes";

interface Props {
  isExplore: boolean;
}

const exploreQuery = gql`
  query StudyRooms {
    userGroups {
      ... on StudyGroup {
        id
        name
        users {
          id
        }
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

const Explore = (props: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
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
    },
    button: {
      margin: theme.spacing(1),
      width: "16%",
    },
  }));
  const classes = useStyles();

  const expData = useQuery<StudyRooms>(exploreQuery, {
    skip: !props.isExplore,
  });

  const classData = useQuery<Classes>(classesQuery, {
    skip: props.isExplore,
  });

  const rooms = props.isExplore
    ? expData.data?.userGroups.filter(
        (item) => item.__typename === "StudyGroup"
      )
    : classData.data?.me?.groups.filter(
        (item) => item.__typename === "ClassGroup"
      );

  if (!rooms) return <LoadingPage />;

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
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            startIcon={<AddIcon />}
          >
            Create Study Room
          </Button>
        ) : (
          <> </>
        )}
      </div>

      {(rooms as Array<
        Classes_me_groups_ClassGroup | StudyRooms_userGroups_StudyGroup
      >).map((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ? (
          <StudyRoomButton
            handleClickOpen={() => console.log("TODO")}
            name={item.name}
            roomSize={item.users.length}
          />
        ) : null
      )}
    </List>
  );
};

export default Explore;
