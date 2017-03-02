import {Component, Input} from "@angular/core";

@Component({
  selector: 'panel-tree',
  templateUrl: 'panel-tree.component.html',
})

export class PanelTreeComponent {
  @Input() nodes = [];
}
