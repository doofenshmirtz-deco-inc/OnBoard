import React, {useState} from "react";
import { makeStyles, Theme } from '@material-ui/core/styles';
import MessageBox from "../../components/MessageBox"
import RecentContacts from "../../components/RecentContacts";

const Recents = () => {
  const [message, setMessageState] = useState("");
  const handleClick = (item: any) => {
    setMessageState(item.name);
  }

  const useStyles = makeStyles((theme: Theme) => ({
    root: {
      flexGrow: 3,
      backgroundColor: theme.palette.background.paper,
      display: "flex"
    }
  }));

  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <RecentContacts handleClick={handleClick}/>
      <MessageBox name={message}/>;
    </div>
  );
};

export default Recents;