export class Task {
  _id?: string;
  title: string;
  description?: string;
  user?: string;
  priority?: number = 5;
  status?: string = '';
  spenttime?: number = 0;
  complexity?: number;
  points?: number;
  velocity?: number;
  parentTaskId?: string;
  date?: string;
  updatedAt?: string;
  simple?: boolean = true;
  estimatedTime?: string;
  timeToDo?: number;
  owner?: string|any;
  developer?: string|any;
  team?: Array<string>;
  files?: [string];
  tags?: [string];
  tagsList?: [string];
  archived?: boolean;
  commentsCounter?: number;
  updatedBy?: string|any;
}
