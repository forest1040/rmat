import { atom, selector } from "recoil";
import { DropResult } from "react-beautiful-dnd";
import DB, { ListTable, CardTable } from "../db";

export type Lists = ListTable[];
export type Cards = CardTable[];

export const listState = atom({
  key: "listState",
  default: DB.listTable.toArray(),
});

// export const listListFilterState = atom({
//   key: "listListFilterState",
//   default: "board",
// });

export const cardState = atom({
  key: "cardState",
  default: DB.cardTable.toArray(),
});

export const allLists = selector({
  key: "allLists",
  get: ({ get }) => {
    return get(listState);
  },
});

export const allCards = selector({
  key: "allCards",
  get: ({ get }) => {
    return get(cardState);
  },
});
