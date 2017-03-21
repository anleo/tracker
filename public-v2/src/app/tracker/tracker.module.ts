import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ToastModule} from 'ng2-toastr/ng2-toastr';
import {SelectModule} from 'ng2-select';
import {ElasticModule} from 'angular2-elastic';
import {LocalStorageModule} from 'angular-2-local-storage';

import {TaskResolver} from "./resolvers/task.resolver";
import {TaskService} from "./services/task.service";
import {TaskResource} from "./resources/tasks.resource";
import {TrackerRoutingModule} from "./tracker.routing.module";

import {TasksBoardFilter} from "./pipes/tasks-board.pipe";

import {TasksComponent} from './tasks/tasks.component';
import {TaskItemComponent} from "./tasks/task-item/task-item.component";
import {TasksListComponent} from './tasks/tasks-list/tasks-list.component';
import {TasksEditComponent} from './tasks/task-edit/task-edit.component';
import {TaskPanelComponent} from "./tasks/task-panel/task-panel.component";

import {TasksBoardComponent} from "./tasks/tasks-board/tasks-board.component";
import {BoardViewComponent} from "./tasks/tasks-board/views/board/board-view.component";
import {ListViewComponent} from "./tasks/tasks-board/views/list/list-view.component";
import {TreeViewComponent} from "./tasks/tasks-board/views/tree/tree-view.component";
import {PanelTreeComponent} from "./tasks/tasks-board/views/tree/panel-tree.component";

import {CommonReportComponent} from "./reports/common-report/common-report.component";
import {DatepickerModule} from 'ng2-bootstrap/datepicker';
import {TaskStatusService} from "./services/task-status.service";
import {TaskMetricsComponent} from './tasks/task-metrics/task-metrics.component';
import {TooltipModule, ProgressbarModule} from "ng2-bootstrap";
import {TaskTeamComponent} from "./tasks/components/task-team/task-team.component";
import {TaskAssignDeveloperComponent} from "./tasks/components/task-assign-developer/task-assign-developer.component";
import {TaskTagsComponent} from "./tasks/components/task-tags/task-tags.component";
import {TaskComplexityComponent} from "./tasks/components/complexity/task-complexity.component";
import {MetricsWidgetComponent} from './tasks/metrics-widget/metrics-widget.component';
import {UploaderComponent} from './tasks/uploader/uploader.component';
import {NgUploaderModule} from 'ngx-uploader';
import {FileViewerComponent} from './tasks/file-viewer/file-viewer.component';
import {TaskSpentTimeComponent} from "./tasks/components/task-spent-time/task-spent-time.component";
import {RoundPipe} from "./pipes/round.pipe";
import {TextLimitPipe} from "./pipes/text-limit.pipe";
import {HumanizeTimePipe} from "./pipes/humanize-time.pipe";
import {TaskDescriptionEditor} from "./tasks/components/task-description-editor/task-description-editor.component";
import {TaskDescriptionViewer} from "./tasks/components/task-description-viewer/task-description-viewer.component";
import {TaskTagsPanelComponent} from "./tasks/components/task-tags-panel/task-tags-panel.component";
import {TaskSearchPipe} from "./pipes/task-search.pipe";
import {TaskMoveComponent} from "./tasks/components/task-move/task-move.component";
import {HumanizeComplexityPipe} from "./pipes/humanize-complexity.pipe";
import {TimeFromNowPipe} from "./pipes/time-from-now.pipe";
import {MyTasksComponent} from "./tasks/my-tasks/my-tasks.component";
import {CommentsComponent} from './tasks/task-comments/task-comments.component';
import {TaskHistoryComponent} from './tasks/task-history/task-history.component';
import {TaskHistoryCommentComponent} from './tasks/task-history/task-history-comment/task-history-comment.component';
import {TaskHistoryDeveloperComponent} from './tasks/task-history/task-history-developer/task-history-developer.component';
import {TaskHistoryComplexityComponent} from './tasks/task-history/task-history-complexity/task-history-complexity.component';
import {TaskHistoryDescriptionComponent} from './tasks/task-history/task-history-description/task-history-description.component';
import {TaskHistoryMetricsComponent} from './tasks/task-history/task-history-metrics/task-history-metrics.component';
import {TaskHistorySpenttimeComponent} from './tasks/task-history/task-history-spenttime/task-history-spenttime.component';
import {TaskHistoryStatusComponent} from './tasks/task-history/task-history-status/task-history-status.component';
import {LinkyModule} from "angular-linky";
import {TaskReportComponent} from "./reports/task-report/task-report.component";
import {TaskArchiveComponent} from "./tasks/task-archive/task-archive.component";
import {BlankComponent} from "../blank/blank.component";
import {MetricsInEditorComponent} from './tasks/components/metrics-in-editor/metrics-in-editor.component';
import {TasksSortPipe} from "./pipes/tasks-sort.pipe";

import {TaskSearchDirective} from './tasks/task-search/task-search.directive';
import {TaskSearchComponent} from "./tasks/task-search/task-search.component";
import {TaskSearchService} from "./services/task-search.service";
import {TaskTagsSearchComponent} from "./tasks/task-tags-search/task-tags-search.component";
import {ParentTaskResolver} from "./resolvers/parent-task.resolver";
import {RootTaskResolver} from "./resolvers/root-task.resolver";
import {CurrentTaskService} from "./services/current-task.service";
import {TaskComponent} from "./tasks/components/task/task.component";
import {DndComponent} from "./dnd/dnd.component";
import {DragComponent} from "./dnd/drag.component";
import {DropDirective} from "./dnd/drop.component";
import {DnDService} from "./dnd/dnd.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TrackerRoutingModule,
    ToastModule.forRoot(),
    DatepickerModule.forRoot(),
    SelectModule,
    TooltipModule.forRoot(),
    NgUploaderModule,
    ProgressbarModule.forRoot(),
    ElasticModule,
    LinkyModule,
    LocalStorageModule.withConfig({
      prefix: '',
      storageType: 'localStorage'
    })
  ],
  exports: [
    TaskSearchDirective,
    BlankComponent
  ],
  declarations: [
    BlankComponent,
    TaskComponent,
    TasksBoardFilter,
    RoundPipe,
    TextLimitPipe,
    HumanizeTimePipe,
    TasksComponent,
    TasksListComponent,
    TasksEditComponent,
    TasksBoardComponent,
    BoardViewComponent,
    ListViewComponent,
    TreeViewComponent,
    PanelTreeComponent,
    TasksSortPipe,
    TaskPanelComponent,
    TaskItemComponent,
    CommonReportComponent,
    TaskReportComponent,
    TaskMetricsComponent,
    TaskTeamComponent,
    TaskAssignDeveloperComponent,
    MetricsWidgetComponent,
    TaskComplexityComponent,
    TaskSpentTimeComponent,
    TaskTagsComponent,
    TaskSearchPipe,
    TaskMoveComponent,
    TaskDescriptionEditor,
    TaskDescriptionViewer,
    TaskTagsPanelComponent,
    TaskTagsSearchComponent,
    TaskMetricsComponent,
    TaskTeamComponent,
    TaskTagsComponent,
    UploaderComponent,
    FileViewerComponent,
    HumanizeComplexityPipe,
    TimeFromNowPipe,
    MyTasksComponent,
    CommentsComponent,
    TaskHistoryComponent,
    TaskHistoryCommentComponent,
    TaskHistoryDeveloperComponent,
    TaskHistoryComplexityComponent,
    TaskHistoryDescriptionComponent,
    TaskHistoryMetricsComponent,
    TaskHistorySpenttimeComponent,
    TaskHistoryStatusComponent,
    TaskArchiveComponent,
    MetricsInEditorComponent,
    TaskArchiveComponent,
    TaskSearchDirective,
    TaskSearchComponent,
    DndComponent,
    DragComponent,
    DropDirective,
    // DropZoneDirective
  ],
  providers: [
    TaskResolver,
    ParentTaskResolver,
    RootTaskResolver,
    TaskResource,
    TaskService,
    CurrentTaskService,
    TaskStatusService,
    TaskSearchService,
    DnDService
  ]
})
export class TrackerModule {
}
