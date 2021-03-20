import React, { useState } from "react";
import { Fab } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { useRecoilState, useRecoilValue } from "recoil";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import List from "./List";
import { listState, cardState } from "../state/model";
import DB from "../db";
import { SwapLists, swapCards } from "../utils/swap";
import { Lists, Cards } from "../state/model";

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
  const [lists, setLists] = useRecoilState(listState);
  const [cards, setCards] = useRecoilState(cardState);

  //const [isRender, setIsRender] = useState(true);

  const boardIdNumber = () => {
    return parseInt("" + boardId, 10);
  };

  const classes = useStyles();
  const handleAddButtonClicked = () => {
    onListAdded(boardIdNumber());
  };

  const onListAdded = (boardId: number) => {
    const index = lists.filter((list) => list.boardId === boardId).length;
    DB.listTable
      .add({
        boardId,
        index,
        title: "",
      })
      .then(() => {
        DB.listTable.toArray().then((list) => setLists(list));
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleDragEnded = (result: DropResult) => {
    onDragEnded(boardIdNumber(), result);
    //setIsRender(false);
  };

  const onDragEnded = (boardId: number, dropResult: DropResult) => {
    const { destination, draggableId, source, type } = dropResult;

    if (destination === undefined || !destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    switch (type) {
      case "List": {
        const dragListId = parseInt(draggableId.replace("listId-", ""), 10);
        SwapLists(boardId, dragListId, source.index, destination.index, lists);
        DB.listTable.toArray().then((list) => setLists(list));
        break;
      }
      case "Card": {
        const dragCardtId = parseInt(draggableId.replace("cardId-", ""), 10);
        const sourceId = parseInt(
          source.droppableId.replace("listId-", ""),
          10
        );
        const destinationId = parseInt(
          destination.droppableId.replace("listId-", ""),
          10
        );
        swapCards(
          boardId,
          dragCardtId,
          sourceId,
          source.index,
          destinationId,
          destination.index,
          cards
        );
        DB.cardTable.toArray().then((cards) => {
          setCards(cards);
        });
        break;
      }
      default:
        break;
    }
  };

  const RenderLists = () => {
    const id = boardIdNumber();
    // TODO:なぜか、useRecoilValueで取り直さないとうまく描画されない。
    //const result = lists
    const ls = useRecoilValue(listState);
    const result = ls
      .filter((list) => list.boardId === id)
      .sort((a, b) => a.index - b.index)
      .map((list, listIndex) => {
        console.log("list.id:" + list.id);
        console.log("listIndex:" + listIndex);
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
              {/* {isRender ? RenderLists() : <></>} */}
              {RenderLists()}
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
