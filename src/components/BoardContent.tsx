import React from "react";
import { Fab } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { useRecoilState, useRecoilValue } from "recoil";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import List from "./List";
//import State from "../state";
import { listState, cardState } from "../state/model";
import DB, { ListTable, CardTable } from "../db";
//import Lists from "../state/model";

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
  //const store = useStore();
  //const Container = State.useContainer();
  //const lists = useRecoilValue(listState);
  //const cards = useRecoilValue(cardState);
  const [lists, setLists] = useRecoilState(listState);
  const [cards, setCards] = useRecoilState(cardState);

  const boardIdNumber = () => {
    return parseInt("" + boardId, 10);
  };

  const classes = useStyles();
  const handleDragEnded = (result: DropResult) => {
    //Container.onDragEnded(boardIdNumber(), result);
    //store.onDragEnded(boardId, result);
    onDragEnded(boardIdNumber(), result);
  };
  const handleAddButtonClicked = () => {
    //Container.OnListAdded(boardIdNumber());
    //store.OnListAdded(boardIdNumber());
    OnListAdded(boardIdNumber());
  };

  const OnListAdded = (boardId: number) => {
    //const lists = useRecoilValue(listState);
    const index = lists.filter((list) => list.boardId === boardId).length;
    DB.listTable
      .add({
        boardId,
        index,
        title: "",
      })
      .then(() => OnListTableUpdateCompleted(boardId))
      .catch((err) => {
        throw err;
      });
  };

  const OnListTableUpdateCompleted = (
    boardId: number,
    skipUpdatedTimestamp = false
  ) => {
    DB.listTable
      .toArray()
      .then((lists) => {
        setLists(lists);
        if (!skipUpdatedTimestamp) {
          const updatedTimestamp = Date.now();
          DB.boardTable.update(boardId, { updatedTimestamp });
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const OnCardTableUpdateCompleted = (
    boardId: number,
    skipUpdatedTimestamp = false
  ) => {
    DB.cardTable
      .toArray()
      .then((cards) => {
        setCards(cards);
        if (!skipUpdatedTimestamp) {
          const updatedTimestamp = Date.now();
          DB.boardTable.update(boardId, { updatedTimestamp });
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const SwapLists = (
    boardId: number,
    draglistId: number,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const lowerIndex =
      destinationIndex > sourceIndex ? sourceIndex : destinationIndex;
    const upperIndex =
      destinationIndex > sourceIndex ? destinationIndex : sourceIndex;
    //const lists = useRecoilValue(allLists);
    const range = lists
      .filter((list) => list.boardId === boardId)
      .sort((a, b) => a.index - b.index)
      .slice(lowerIndex, upperIndex + 1);
    const dragList = range.find((list) => list.id === draglistId);

    if (dragList) {
      if (dragList.index === lowerIndex) {
        range.splice(0, 1);
        range.splice(range.length, 0, dragList);
      } else {
        range.splice(range.length - 1, 1);
        range.splice(0, 0, dragList);
      }

      let indexOfRange = 0;
      const promiseArray: Promise<number>[] = [];
      for (let index = lowerIndex; index <= upperIndex; index += 1) {
        range[indexOfRange].index = index;
        const { id } = range[indexOfRange];
        if (id) {
          promiseArray.push(
            DB.listTable.update(id, { index }).catch((err) => {
              throw err;
            })
          );
        }
        indexOfRange += 1;
      }

      Promise.all(promiseArray).then(() => OnListTableUpdateCompleted(boardId));
    }
  };

  const SwapCardsInTheSameList = (
    boardId: number,
    dragCardtId: number,
    sourceIndex: number,
    destinationId: number,
    destinationIndex: number
  ) => {
    const lowerIndex =
      destinationIndex > sourceIndex ? sourceIndex : destinationIndex;
    const upperIndex =
      destinationIndex > sourceIndex ? destinationIndex : sourceIndex;
    //const cards = useRecoilValue(allCards);
    const range = cards
      .filter((card) => card.listId === destinationId)
      .sort((a, b) => a.index - b.index)
      .slice(lowerIndex, upperIndex + 1);
    const dragCard = range.find((card) => card.id === dragCardtId);

    if (dragCard) {
      if (dragCard.index === lowerIndex) {
        range.splice(0, 1);
        range.splice(range.length, 0, dragCard);
      } else {
        range.splice(range.length - 1, 1);
        range.splice(0, 0, dragCard);
      }

      let indexOfRange = 0;
      const promiseArray: Promise<number>[] = [];
      for (let index = lowerIndex; index <= upperIndex; index += 1) {
        range[indexOfRange].index = index;
        const { id } = range[indexOfRange];
        if (id) {
          promiseArray.push(
            DB.cardTable.update(id, { index }).catch((err) => {
              throw err;
            })
          );
        }
        indexOfRange += 1;
      }

      Promise.all(promiseArray).then(() => OnCardTableUpdateCompleted(boardId));
    }
  };

  const SwapCardsInDifferentList = (
    boardId: number,
    dragCardtId: number,
    sourceId: number,
    sourceIndex: number,
    destinationId: number,
    destinationIndex: number
  ) => {
    //const cards = useRecoilValue(allCards);
    const sourceRange = cards
      .filter((card) => card.listId === sourceId)
      .slice(sourceIndex);
    const destinationRange = cards
      .filter((card) => card.listId === destinationId)
      .slice(destinationIndex);
    const dragCard = cards.find((card) => card.id === dragCardtId);

    if (dragCard) {
      sourceRange.splice(0, 1);
      destinationRange.splice(0, 0, dragCard);

      let index = sourceIndex;
      const promiseArray: Promise<number>[] = [];
      for (
        let indexOfRange = 0;
        indexOfRange < sourceRange.length;
        indexOfRange += 1
      ) {
        sourceRange[indexOfRange].index = index;
        const { id } = sourceRange[indexOfRange];
        if (id) {
          promiseArray.push(
            DB.cardTable.update(id, { index }).catch((err) => {
              throw err;
            })
          );
        }

        index += 1;
      }

      index = destinationIndex;
      for (
        let indexOfRange = 0;
        indexOfRange < destinationRange.length;
        indexOfRange += 1
      ) {
        destinationRange[indexOfRange].index = index;
        const { id } = destinationRange[indexOfRange];
        if (id && index === destinationIndex) {
          destinationRange[indexOfRange].listId = destinationId;
          promiseArray.push(
            DB.cardTable
              .update(id, { listId: destinationId, index })
              .catch((err) => {
                throw err;
              })
          );
        } else if (id) {
          promiseArray.push(
            DB.cardTable.update(id, { index }).catch((err) => {
              throw err;
            })
          );
        }

        index += 1;
      }

      Promise.all(promiseArray).then(() => OnCardTableUpdateCompleted(boardId));
    }
  };

  const swapCards = (
    boardId: number,
    dragCardtId: number,
    sourceId: number,
    sourceIndex: number,
    destinationId: number,
    destinationIndex: number
  ) => {
    if (sourceId === destinationId) {
      SwapCardsInTheSameList(
        boardId,
        dragCardtId,
        sourceIndex,
        destinationId,
        destinationIndex
      );
    } else {
      SwapCardsInDifferentList(
        boardId,
        dragCardtId,
        sourceId,
        sourceIndex,
        destinationId,
        destinationIndex
      );
    }
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
        SwapLists(boardId, dragListId, source.index, destination.index);
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
          destination.index
        );
        break;
      }
      default:
        break;
    }
  };

  const RenderLists = () => {
    const id = boardIdNumber();
    //const result = store.allLists
    const lists = useRecoilValue(listState);
    const result = lists
      .filter((list) => list.boardId === id)
      .sort((a, b) => a.index - b.index)
      .map((list, listIndex) => {
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
