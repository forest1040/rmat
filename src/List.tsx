import React, { useEffect, useState, useRef } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { grey } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
//import ListTitleArea from "./ListTitleArea";
import Card from "./Card";

interface Props {
  boardId: number;
  listId: number;
  listIndex: number;
}

const useStyles = makeStyles(() => {
  return createStyles({
    paper: {
      backgroundColor: "#fff",
      flex: "0 0 400px",
      width: "400px",
      height: "fit-content",
      margin: "16px",
    },
    container: {
      paddingBottom: "40px",
    },
    buttonArea: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "16px",
    },
  });
});

const List: React.FC<Props> = (props) => {
  const isInitialMount = useRef(true);
  const classes = useStyles();

  const { boardId, listId, listIndex } = props;

  //const Container = State.useContainer();
  //const [cards, setCards] = useState<CardTable[]>([]);
  const [isDragDisabled, setIsDragDisabled] = useState(false);

  //   useEffect(() => {
  //     if (isInitialMount.current) {
  //       isInitialMount.current = false;

  //       DB.cardTable
  //         .where("listId")
  //         .equals(listId)
  //         .sortBy("index")
  //         .then((data) => setCards(data))
  //         .catch((err) => {
  //           throw err;
  //         });
  //     } else {
  //       const updatedTimestamp = Date.now();
  //       DB.boardTable.update(boardId, { updatedTimestamp });
  //     }
  //   }, [cards]);

  const onAddButtonClicked = () => {
    //Container.onCardAdded(boardId, listId);
  };

  const onDeleteButtonClicked = () => {
    //Container.onListDeleted(boardId, listId);
  };

  const renderCards = () => {
    // const result = Container.allCards
    //   .filter((card) => card.listId === listId)
    //   .sort((a, b) => a.index - b.index)
    //   .map((card, cardIndex) => {
    //     if (!card.id) {
    //       return <></>;
    //     }
    //     return (
    //       <Card
    //         key={card.id}
    //         boardId={boardId}
    //         cardId={card.id}
    //         cardIndex={cardIndex}
    //         onClicked={setIsDragDisabled}
    //       />
    //     );
    //   });
    // return result;
    return (
      <>
        <Card
          key={1}
          boardId={1}
          cardId={1}
          cardIndex={1}
          onClicked={setIsDragDisabled}
        />
        <Card
          key={2}
          boardId={2}
          cardId={2}
          cardIndex={2}
          onClicked={setIsDragDisabled}
        />
      </>
    );
  };

  return (
    <Draggable
      draggableId={`listId-${listId}`}
      index={listIndex}
      isDragDisabled={isDragDisabled}
    >
      {(provided) => (
        <Paper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
          className={classes.paper}
        >
          <div className={classes.buttonArea}>
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="Add new card"
              onClick={onAddButtonClicked}
            >
              <AddIcon />
              ADD NEW CARD
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="secondary"
              aria-label="Delete this list"
              onClick={onDeleteButtonClicked}
            >
              <DeleteIcon />
              DELETE THIS LIST
            </Fab>
          </div>
          {/* <ListTitleArea boardId={boardId} listId={listId} /> */}
          <Droppable droppableId={`listId-${listId}`} type="Card">
            {(cardProvided) => (
              <div
                className={classes.container}
                {...cardProvided.droppableProps}
                ref={cardProvided.innerRef}
              >
                {renderCards()}
                {cardProvided.placeholder}
              </div>
            )}
          </Droppable>
        </Paper>
      )}
    </Draggable>
  );
};

export default List;
