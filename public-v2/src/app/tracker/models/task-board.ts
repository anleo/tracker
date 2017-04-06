export class TaskBoard {
  _id?: string;
  title: string = null;
  project?: string;
  status?: string;
  shared?: Array<string>;
  owner?: string;
  time?: number;
}

