import React from "react";
//import CssBaseline from "@material-ui/core/CssBaseline";
import { Paper, Fab } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";

import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import List from "./List";
import { allLists, onDragEnded } from "../model/data";

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

// TODO: boardIdの採番
const boardId = 1;

const BoardContent: React.FC = () => {
  const boardIdNumber = () => {
    return parseInt("" + boardId, 10);
  };

  const classes = useStyles();
  const handleDragEnded = (result: DropResult) => {
    //Container.onDragEnded(boardIdNumber(), result);
    onDragEnded(boardId, result);
  };
  const handleAddButtonClicked = () => {
    //Container.onListAdded(boardIdNumber());
  };

  const renderLists = () => {
    console.log("renderLists");
    const id = boardIdNumber();
    const result = allLists
      .filter((list) => list.boardId === id)
      .sort((a, b) => a.index - b.index)
      .map((list, listIndex) => {
        //console.log("list.id:" + list.id);
        //console.log("listIndex:" + listIndex);
        if (!list.id) {
          return <></>;
        }
        return (
          <List
            key={list.id}
            boardId={id}
            listId={list.id}
            listIndex={listIndex}
          />
        );
      });
    return result;
  };

  return (
    <div className={classes.dragDropRoot}>
      <DragDropContext onDragEnd={handleDragEnded}>
        <Droppable
          droppableId={`${boardId}`}
          direction="horizontal"
          type="List"
        >
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
        </Fab>
      </div>
    </div>
  );
};

export default BoardContent;
