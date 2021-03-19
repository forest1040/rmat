import React, { useState } from "react";
//import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import Typography from "@material-ui/core/Typography";
//import State from "../State";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { allLists } from "../model/data";
import classes from "*.module.css";

interface Props {
  boardId: number;
  listId: number;
}

const useStyles = makeStyles(() => {
  return createStyles({
    listTitleArea: {
      display: "flex",
      alignItems: "center",
      marginTop: "8px",
    },
    listTitleForm: {
      flexBasis: "80%",
      marginLeft: "8px",
    },
    listTitleTextField: {
      width: "100%",
    },
    listTitle: {
      display: "flex",
      alignItems: "center",
      width: "100%",
      minHeight: "72px",
      padding: "0 16px",
      cursor: "pointer",
    },
    listTitleTypography: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    editIconArea: {
      flexBasis: "20%",
      margin: "0 16px",
      textAlign: "center",
    },
  });
});

const ListTitleArea: React.FC<Props> = (props) => {
  const { boardId, listId } = props;
  const classes = useStyles();

  //const Container = State.useContainer();
  const [isInputArea, setIsInputArea] = useState(false);

  const list = allLists.find((listData) => listData.id === listId);
  const ListTitle = list?.title || "";
  const [title, setTitle] = useState(ListTitle);

  const handleisInputAreaChange = () => {
    //Container.onListTitleChanged(boardId, listId, title);
    setIsInputArea(!isInputArea);
  };

  const handleListTitleChanged = (
    event: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setTitle(event.target.value);
  };

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleisInputAreaChange();
    }
  };

  return (
    <div className={classes.listTitleArea}>
      {isInputArea ? (
        <div className={classes.listTitleForm}>
          <TextField
            className={classes.listTitleTextField}
            id="list-name"
            label="Card Title"
            value={title}
            margin="normal"
            autoFocus
            onChange={handleListTitleChanged}
            onKeyPress={handleKeyPressed}
            onBlur={handleisInputAreaChange}
          />
        </div>
      ) : (
        <div className={classes.listTitle} onClick={handleisInputAreaChange}>
          <Typography
            className={classes.listTitleTypography}
            variant="h6"
            gutterBottom
          >
            {title || "The title is empty"}
          </Typography>
        </div>
      )}
      {isInputArea && (
        <div className={classes.editIconArea}>
          <Fab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="DONE"
            onClick={handleisInputAreaChange}
          >
            <CheckIcon />
          </Fab>
        </div>
      )}
    </div>
  );
};

export default ListTitleArea;
