export class Task {
  _id?: string;
  title: string;
  description?: string;
  user?: string;
  priority?: number;
  status?: string;
  spenttime?: number;
  complexity?: number;
  points?: number;
  velocity?: number;
  parentTaskId?: string;
  date?: string;
  updatedAt?: string;
  simple?: boolean;
  estimatedTime?: string;
  timeToDo?: number;
  owner?: string;
  developer?: string;
  team?: [string];
  files?: [string];
  tags?: [string];
  tagsList?: [string];
  archived?: boolean;
  commentsCounter?: number;
  updatedBy?: string;
}
