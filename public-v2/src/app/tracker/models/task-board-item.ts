export class TaskBoardItem {
  _id?: string;
  board?: any;
  type?: string;
  item?: any;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  timeLog?: any = [];
  subBoardItems?: TaskBoardItem[] = [];
}
