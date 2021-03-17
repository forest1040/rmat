export interface BoardTable {
  id?: number;
  createdTimestamp: number;
  title: string;
  updatedTimestamp: number;
}

export interface ListTable {
  id?: number;
  boardId: number;
  index: number;
  title: string;
}

export interface CardTable {
  id?: number;
  listId: number;
  index: number;
  text: string;
}

export type Cards = CardTable[];
