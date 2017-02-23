import {Component, OnInit, Input} from "@angular/core";

@Component({
  selector: 'task-description-viewer',
  templateUrl: 'task-description-viewer.component.html'
})

export class TaskDescriptionViewer implements OnInit {
  @Input() description: string;
  @Input() limit: number = 80;

  showMore: boolean = false;

  ngOnInit(): void {
    this.description = this.parseText(this.description) || '';
  }

  toggleShowMore(): void {
    this.showMore = !this.showMore;
  }

  protected parseText(text) {
    return text.replace(/</gm, '&lt')
      .replace(/>/gm, '&gt')
      .replace(/\r\n|\n/g, " <br /> ")
      .replace(/(https?:\/\/[^\s]+)/g, function (url) {
        return ' <a href="' + url + '" target="_blank">' + url + '</a> ';
      });
  }
}
