export class Task {
  _id?: string;
  title: string;
  description?: string;
  user?: string;
  priority?: number = 5;
  status?: string = '';
  spenttime?: number;
  complexity?: number;
  points?: number;
  velocity?: number;
  parentTaskId?: string;
  date?: string;
  updatedAt?: string;
  simple?: boolean = true;
  estimatedTime?: number;
  timeToDo?: number;
  owner?: string|any;
  developer?: string|any;
  team?: Array<string>;
  files?: string[];
  tags?: Array<string>;
  tagsList?: Array<string>;
  archived?: boolean;
  commentsCounter?: number;
  updatedBy?: string|any;
}
