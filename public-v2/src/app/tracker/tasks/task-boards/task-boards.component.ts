import {Component, OnInit} from "@angular/core";
import {BoardService} from "../../services/board.service";
import {TaskBoard} from "../../models/task-board";
import {CurrentTaskService} from "../../services/current-task.service";

@Component({
  selector: 'task-boards',
  templateUrl: 'task-boards.component.html'
})

export class TaskBoardsComponent implements OnInit {
  boards: TaskBoard[] | null = [
    {
      title: 'sprint 1',
      status: 'in progress',
      _id: 'asdawdawd1231',
      project: '23ewef23r2',
      shared: ['213qd23', '1231edasd23'],
      owner: '213qd23',
      time: 8
    },
    {
      title: 'sprint 2',
      status: 'accepted',
      _id: 'asdawawd1232',
      project: '23ewef23r2',
      shared: ['213qd23', '1241edasd23'],
      owner: '213qd23',
      time: 5
    }
  ];
  newBoard: TaskBoard | null;

  statusTypess: [{
    id: 'new',
    name: 'New',
    value: ''
  },
    {
      id: 'in_progress',
      name: 'In progress',
      value: 'in progress'
    },
    {
      id: 'accepted',
      name: 'Accepted',
      value: 'accepted'
    }]


  constructor(private boardService: BoardService,
              private currentTaskService: CurrentTaskService) {
  }

  ngOnInit(): void {
    this.currentTaskService.task$.subscribe((task) => {
      if (!task) {
        return;
      }

      this.initBoard();


      // this.boardService.getBoards(task)
      //   .subscribe((boards) => this.boards = boards)
    });
  }

  save(): void {
    this.boardService.saveBoard(this.newBoard)
  }

  initBoard(): void {
    this.newBoard = new TaskBoard();
    this.newBoard.project = this.currentTaskService.task._id;
  }
}
