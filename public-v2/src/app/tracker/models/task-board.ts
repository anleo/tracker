export class TaskBoard {
  _id?: string;
  title?: string = null;
  project?: string;
  status?: string = '';
  shared?: Array<string>;
  owner?: string;
  time?: number = 0;
  pointCost?: number = 0;
  createdAt?: string;
  updatedAt?: string;
  priority?: number = 5;
  type?: string;
}
