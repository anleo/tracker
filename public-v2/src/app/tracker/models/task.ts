import {User} from "../../user/models/user";
export class Task {
  _id?: string;
  title: string;
  description?: string;
  user?: string;
  priority?: number = 5;
  status?: string = '';
  spenttime?: number = 0;
  complexity?: number = 0;
  points?: number;
  velocity?: number;
  parentTaskId?: string;
  date?: string;
  updatedAt?: string;
  simple?: boolean = true;
  estimatedTime?: number = 0;
  timeToDo?: number = 0;
  owner?: string|any;
  developer?: User;
  team?: Array<string>;
  files?: string[] = [];
  tags?: Array<string> = [];
  tagsList?: Array<string> = [];
  archived?: boolean;
  commentsCounter?: number;
  updatedBy?: string|any;
  subTasks?: Array<Task>;
}
