import React from "react";
//import CssBaseline from "@material-ui/core/CssBaseline";
import { Paper, Fab } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import List from "./List";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    dragDropRoot: {
      display: "flex",
    },
    container: {
      display: "flex",
    },
    addbuttonArea: {
      flex: "0 0 360px",
      marginTop: "32px",
    },
  });
});

const BoardContent: React.FC = () => {
  const classes = useStyles();
  const handleDragEnded = (result: DropResult) => {
    //Container.onDragEnded(boardIdNumber(), result);
  };
  const handleAddButtonClicked = () => {
    //Container.onListAdded(boardIdNumber());
  };

  const renderLists = () => {
    return (
      <>
        <List key={1} boardId={1} listId={1} listIndex={1} />
        <List key={2} boardId={2} listId={2} listIndex={2} />
        <List key={3} boardId={3} listId={3} listIndex={3} />
      </>
    );
  };

  return (
    <div className={classes.dragDropRoot}>
      <DragDropContext onDragEnd={handleDragEnded}>
        <Droppable droppableId={"1"} direction="horizontal" type="List">
          {(provided) => (
            <div
              className={classes.container}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {renderLists()}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className={classes.addbuttonArea}>
        <Fab
          variant="extended"
          size="medium"
          color="primary"
          aria-label="Add new list"
          onClick={handleAddButtonClicked}
        >
          <AddIcon />
          ADD NEW LIST
        </Fab>
      </div>
    </div>
  );
};

export default BoardContent;
