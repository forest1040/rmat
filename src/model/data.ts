import { DropResult } from "react-beautiful-dnd";
import { BoardTable, ListTable, CardTable } from "../db";

// export interface BoardTable {
//   id?: number;
//   createdTimestamp: number;
//   title: string;
//   updatedTimestamp: number;
// }

// export interface ListTable {
//   id?: number;
//   boardId: number;
//   index: number;
//   title: string;
// }

// export interface CardTable {
//   id?: number;
//   listId: number;
//   index: number;
//   text: string;
// }

export type Lists = ListTable[];
//const allLists = <Lists>[];
export const allLists: Lists = [
  { id: 1, boardId: 1, index: 1, title: "AAA" },
  { id: 2, boardId: 1, index: 2, title: "BBB" },
  { id: 3, boardId: 1, index: 3, title: "CCC" },
];

export type Cards = CardTable[];
export const allCards: Cards = [
  { id: 1, listId: 1, index: 1, text: "CARD AAA 1" },
  { id: 2, listId: 1, index: 2, text: "CARD AAA 2" },
  { id: 3, listId: 2, index: 1, text: "CARD BBB 1" },
  //{ id: 4, listId: 2, index: 2, text: "CARD BBB 2" },
  { id: 5, listId: 3, index: 1, text: "CARD CCC 1" },
  { id: 6, listId: 3, index: 2, text: "CARD CCC 2" },
  { id: 7, listId: 3, index: 3, text: "CARD CCC 3" },
];

const swapLists = (
  boardId: number,
  draglistId: number,
  sourceIndex: number,
  destinationIndex: number
) => {
  const lowerIndex =
    destinationIndex > sourceIndex ? sourceIndex : destinationIndex;
  const upperIndex =
    destinationIndex > sourceIndex ? destinationIndex : sourceIndex;
  const range = allLists
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

    // let indexOfRange = 0;
    // const promiseArray: Promise<number>[] = [];
    // for (let index = lowerIndex; index <= upperIndex; index += 1) {
    //   range[indexOfRange].index = index;
    //   const { id } = range[indexOfRange];
    //   if (id) {
    //     promiseArray.push(
    //       DB.listTable.update(id, { index }).catch((err) => {
    //         throw err;
    //       })
    //     );
    //   }
    //   indexOfRange += 1;
    // }
    // Promise.all(promiseArray).then(() => onListTableUpdateCompleted(boardId));

    let indexOfRange = 0;
    for (let index = lowerIndex; index <= upperIndex; index += 1) {
      range[indexOfRange].index = index;
      const { id } = range[indexOfRange];
      if (id) {
        const found = allLists.find((l) => l.id === id);
        if (found) {
          found.index = index;
        }
      }
      indexOfRange += 1;
    }
  }
};

const swapCardsInTheSameList = (
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
  const range = allCards
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

    // let indexOfRange = 0;
    // const promiseArray: Promise<number>[] = [];
    // for (let index = lowerIndex; index <= upperIndex; index += 1) {
    //   range[indexOfRange].index = index;
    //   const { id } = range[indexOfRange];
    //   if (id) {
    //     promiseArray.push(
    //       DB.cardTable.update(id, { index }).catch((err) => {
    //         throw err;
    //       })
    //     );
    //   }
    //   indexOfRange += 1;
    // }
    // Promise.all(promiseArray).then(() => onCardTableUpdateCompleted(boardId));

    let indexOfRange = 0;
    for (let index = lowerIndex; index <= upperIndex; index += 1) {
      range[indexOfRange].index = index;
      const { id } = range[indexOfRange];
      if (id) {
        const found = allCards.find((c) => c.id === id);
        if (found) {
          found.index = index;
        }
      }
      indexOfRange += 1;
    }
  }
};

const swapCardsInDifferentList = (
  boardId: number,
  dragCardtId: number,
  sourceId: number,
  sourceIndex: number,
  destinationId: number,
  destinationIndex: number
) => {
  const sourceRange = allCards
    .filter((card) => card.listId === sourceId)
    .slice(sourceIndex);
  const destinationRange = allCards
    .filter((card) => card.listId === destinationId)
    .slice(destinationIndex);
  const dragCard = allCards.find((card) => card.id === dragCardtId);

  // if (dragCard) {
  //   sourceRange.splice(0, 1);
  //   destinationRange.splice(0, 0, dragCard);

  //   let index = sourceIndex;
  //   const promiseArray: Promise<number>[] = [];
  //   for (
  //     let indexOfRange = 0;
  //     indexOfRange < sourceRange.length;
  //     indexOfRange += 1
  //   ) {
  //     sourceRange[indexOfRange].index = index;
  //     const { id } = sourceRange[indexOfRange];
  //     if (id) {
  //       promiseArray.push(
  //         DB.cardTable.update(id, { index }).catch((err) => {
  //           throw err;
  //         })
  //       );
  //     }

  //     index += 1;
  //   }

  // index = destinationIndex;
  // for (
  //   let indexOfRange = 0;
  //   indexOfRange < destinationRange.length;
  //   indexOfRange += 1
  // ) {
  //   destinationRange[indexOfRange].index = index;
  //   const { id } = destinationRange[indexOfRange];
  //   if (id && index === destinationIndex) {
  //     destinationRange[indexOfRange].listId = destinationId;
  //     promiseArray.push(
  //       DB.cardTable
  //         .update(id, { listId: destinationId, index })
  //         .catch((err) => {
  //           throw err;
  //         })
  //     );
  //   } else if (id) {
  //     promiseArray.push(
  //       DB.cardTable.update(id, { index }).catch((err) => {
  //         throw err;
  //       })
  //     );
  //   }

  //   index += 1;
  // }

  // Promise.all(promiseArray).then(() => onCardTableUpdateCompleted(boardId));
  // }

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
        const found = allCards.find((c) => c.id === id);
        if (found) {
          found.index = index;
        }
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
        const found = allCards.find((c) => c.id === id);
        if (found) {
          found.listId = destinationId;
          found.index = index;
        }
      } else if (id) {
        const found = allCards.find((c) => c.id === id);
        if (found) {
          found.index = index;
        }
      }
      index += 1;
    }
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
    swapCardsInTheSameList(
      boardId,
      dragCardtId,
      sourceIndex,
      destinationId,
      destinationIndex
    );
  } else {
    swapCardsInDifferentList(
      boardId,
      dragCardtId,
      sourceId,
      sourceIndex,
      destinationId,
      destinationIndex
    );
  }
};

export const onDragEnded = (boardId: number, dropResult: DropResult) => {
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
      swapLists(boardId, dragListId, source.index, destination.index);
      break;
    }
    case "Card": {
      const dragCardtId = parseInt(draggableId.replace("cardId-", ""), 10);
      const sourceId = parseInt(source.droppableId.replace("listId-", ""), 10);
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
