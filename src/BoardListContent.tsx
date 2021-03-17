import React from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Paper, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      padding: "10px",
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: "center",
      "& > *": {
        margin: theme.spacing(3),
      },
    },
    aboutArea: {
      marginTop: "16px",
      textAlign: "center",
    },
  })
);

const BoardListContent: React.FC = () => {
  const classes = useStyles();
  const handleAddButtonClicked = () => {
    //StateContainer.onBoardAdded();
  };
  return (
    <Paper className={classes.paper}>
      <div className={classes.aboutArea}>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="Add new board"
          onClick={handleAddButtonClicked}
        >
          <AddIcon />
          ADD NEW BOARD
        </Fab>
      </div>
    </Paper>
  );
};

export default BoardListContent;
