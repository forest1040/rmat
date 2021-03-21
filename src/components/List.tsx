import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { grey } from "@material-ui/core/colors";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import ListTitleArea from "./ListTitleArea";
import Card from "./Card";
//import State from "../state";
import { useRecoilState, useRecoilValue } from "recoil";
import { listState, cardState } from "../state/model";
import DB from "../db";

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
      paddingBottom: "5px",
    },
    buttonArea: {
      display: "flex",
      justifyContent: "space-around",
      //marginTop: "4px",
      marginBottom: "10px",
    },
  });
});

const List: React.FC<Props> = (props) => {
  //const store = useStore();
  //const Container = State.useContainer();

  const isInitialMount = useRef(true);
  const classes = useStyles();

  const history = useHistory();

  const { boardId, listId, listIndex } = props;

  const [lists, setLists] = useRecoilState(listState);
  //const [cards, setCards] = useState<CardTable[]>([]);
  const [cards, setCards] = useRecoilState(cardState);
  //const cards = useRecoilValue(allCards);
  const [isDragDisabled, setIsDragDisabled] = useState(false);

  // useEffect(() => {
  //   if (isInitialMount.current) {
  //     isInitialMount.current = false;

  //     DB.cardTable
  //       .where("listId")
  //       .equals(listId)
  //       .sortBy("index")
  //       .then((data) => setCards(data))
  //       .catch((err) => {
  //         throw err;
  //       });
  //   } else {
  //     const updatedTimestamp = Date.now();
  //     DB.boardTable.update(boardId, { updatedTimestamp });
  //   }
  // }, [cards]);

  const OnCardAdded = (boardId: number, listId: number) => {
    //const cards = useRecoilValue(allCards);
    cards
      .filter((card) => card.listId === listId)
      .forEach((card) => {
        if (!card.id) {
          return;
        }
        DB.cardTable.update(card.id, {
          index: card.index + 1,
        });
      });
    DB.cardTable
      .add({
        listId,
        index: 0,
        text: "",
      })
      // .then(() => {
      //   DB.cardTable.toArray().then((cards) => {
      //     setCards(cards);
      //   });
      // })
      .catch((err) => {
        throw err;
      });
  };

  const OnListDeleted = (boardId: number, listId: number) => {
    const cardPromiseArray: Promise<void>[] = [];
    //const cards = useRecoilValue(allCards);
    cards
      .filter((card) => card.listId === listId)
      .forEach((card) => {
        if (card.id) {
          cardPromiseArray.push(
            DB.cardTable.delete(card.id).catch((err) => {
              throw err;
            })
          );
        }
      });

    Promise.all(cardPromiseArray)
      .then(() => {
        DB.cardTable.toArray().then((cards) => {
          setCards(cards);
        });
        DB.listTable
          .delete(listId)
          .then(() => {
            DB.listTable.toArray().then((list) => setLists(list));
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  };

  const onAddButtonClicked = () => {
    //Container.OnCardAdded(boardId, listId);
    //store.OnCardAdded(boardId, listId);
    OnCardAdded(boardId, listId);
  };

  const onEditButtonClicked = () => {
    history.push("/edit");
  };

  const onDeleteButtonClicked = () => {
    //Container.OnListDeleted(boardId, listId);
    //store.OnListDeleted(boardId, listId);
    OnListDeleted(boardId, listId);
  };

  const RenderCards = () => {
    console.log("RenderCards");
    //const result = store.allCards
    //const cards = useRecoilValue(cardState);
    const result = cards
      .filter((card) => card.listId === listId)
      .sort((a, b) => a.index - b.index)
      .map((card, cardIndex) => {
        if (!card.id) {
          return <></>;
        }
        return (
          <Card
            key={card.id}
            boardId={boardId}
            cardId={card.id}
            cardIndex={cardIndex}
            onClicked={setIsDragDisabled}
          />
        );
      });
    return result;
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
          <ListTitleArea boardId={boardId} listId={listId} />
          <Droppable droppableId={`listId-${listId}`} type="Card">
            {(cardProvided) => (
              <div
                className={classes.container}
                {...cardProvided.droppableProps}
                ref={cardProvided.innerRef}
              >
                {RenderCards()}
                {cardProvided.placeholder}
              </div>
            )}
          </Droppable>
          <div className={classes.buttonArea}>
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="Add new card"
              onClick={onAddButtonClicked}
            >
              <AddIcon />
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="Edit List"
              onClick={onEditButtonClicked}
            >
              <EditIcon />
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="secondary"
              aria-label="Delete this list"
              onClick={onDeleteButtonClicked}
            >
              <DeleteIcon />
            </Fab>
          </div>
        </Paper>
      )}
    </Draggable>
  );
};

export default List;
