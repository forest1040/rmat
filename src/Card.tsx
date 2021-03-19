import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
// import parse2Markdown from "remark-parse";
// import remark2rehype from "remark-rehype";
// import highlight from "rehype-highlight";
// import rehype2react from "rehype-react";
import { TextField } from "@material-ui/core";
import MaterialCard from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { grey } from "@material-ui/core/colors";
import Fab from "@material-ui/core/Fab";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
//import State from "../State";
//import "highlight.js/styles/default.css";
import { allCards } from "./data";
//import { CardTable } from "./data";

interface Props {
  boardId: number;
  cardId: number;
  cardIndex: number;
  onClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

// const processor = unified()
//   .use(parse2Markdown)
//   .use(remark2rehype)
//   .use(highlight)
//   .use(rehype2react, { createElement: React.createElement });

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      //zIndex: theme.zIndex.drawer + 1,
    },
    card: {
      backgroundColor: "#fff",
      padding: "0px",
      margin: "8px 16px",
    },
    cardContent: {
      width: "100%",
      minHeight: "72px",
      whiteSpace: "pre-line",
    },
    toolbar: {
      marginBottom: "16px",
      ...theme.mixins.toolbar,
    },
    styledButtonArea: {
      display: "flex",
      justifyContent: "space-around",
      marginTop: "16px",
      marginBottom: "16px",
    },
  });
});

const Card: React.FC<Props> = (props) => {
  const { boardId, cardId, cardIndex } = props;
  const classes = useStyles();

  //const Container = State.useContainer();
  const [isInputArea, setIsInputArea] = useState(false);
  //const isInputArea = false;

  //const card = Container.allCards.find((cardData) => cardData.id === cardId);
  //const card = { id: 0, listId: 0, index: 0, text: "cardA" };
  const card = allCards.find((cardData) => cardData.id === cardId);
  const cardText = card?.text || "";
  const [text, setValue] = useState(cardText);

  const editorColor = "vs";

  useEffect(() => {
    const { onClicked } = props;
    onClicked(isInputArea);
  }, [isInputArea]);

  const handleIsInputAreaChange = () => {
    if (isInputArea) {
      //Container.onCardTextChanged(boardId, cardId, text);
    }
    setIsInputArea(!isInputArea);
  };

  const handleValueChanged = (value: string) => {
    setValue(value);
  };

  const handleDeleteButtonClicked = () => {
    //Container.onCardDeleted(boardId, cardId);
  };

  return (
    <>
      {isInputArea ? (
        <>
          <TextField id="standard-basic" label="Standard" value={text} />
          <div className={classes.styledButtonArea}>
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="DONE"
              onClick={handleIsInputAreaChange}
            >
              <CheckIcon />
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="secondary"
              aria-label="Delete this card"
              onClick={handleDeleteButtonClicked}
            >
              <DeleteIcon />
            </Fab>
          </div>
        </>
      ) : (
        <Draggable draggableId={`cardId-${cardId}`} index={cardIndex}>
          {(provided) => (
            <MaterialCard
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
              className={classes.card}
            >
              <CardContent>
                <div
                  className={classes.cardContent}
                  onClick={handleIsInputAreaChange}
                >
                  {/* {processor.processSync(text).contents} */}
                  {text}
                </div>
              </CardContent>
            </MaterialCard>
          )}
        </Draggable>
      )}
    </>
  );
};

export default Card;
