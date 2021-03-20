import DB from "../db";
import { Lists, Cards } from "../state/model";

export const SwapLists = (
  boardId: number,
  draglistId: number,
  sourceIndex: number,
  destinationIndex: number,
  lists: Lists
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
      //range[indexOfRange].index = index;
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

    //Promise.all(promiseArray).then(() => OnListTableUpdateCompleted(boardId));
  }
};

const SwapCardsInTheSameList = (
  boardId: number,
  dragCardtId: number,
  sourceIndex: number,
  destinationId: number,
  destinationIndex: number,
  cards: Cards
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
      //range[indexOfRange].index = index;
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

    //Promise.all(promiseArray).then(() => OnCardTableUpdateCompleted(boardId));
  }
};

const SwapCardsInDifferentList = (
  boardId: number,
  dragCardtId: number,
  sourceId: number,
  sourceIndex: number,
  destinationId: number,
  destinationIndex: number,
  cards: Cards
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
      //sourceRange[indexOfRange].index = index;
      //sourceRange[indexOfRange]["index"] = index;
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
      //destinationRange[indexOfRange].index = index;
      //destinationRange[indexOfRange]["index"] = index;
      const { id } = destinationRange[indexOfRange];
      if (id && index === destinationIndex) {
        //destinationRange[indexOfRange].listId = destinationId;
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

    //Promise.all(promiseArray).then(() => OnCardTableUpdateCompleted(boardId));
  }
};

export const swapCards = (
  boardId: number,
  dragCardtId: number,
  sourceId: number,
  sourceIndex: number,
  destinationId: number,
  destinationIndex: number,
  cards: Cards
) => {
  if (sourceId === destinationId) {
    SwapCardsInTheSameList(
      boardId,
      dragCardtId,
      sourceIndex,
      destinationId,
      destinationIndex,
      cards
    );
  } else {
    SwapCardsInDifferentList(
      boardId,
      dragCardtId,
      sourceId,
      sourceIndex,
      destinationId,
      destinationIndex,
      cards
    );
  }
};
