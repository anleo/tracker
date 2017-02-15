"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var tasks_component_1 = require("./tasks/tasks.component");
var tracker_routing_module_1 = require("./tracker.routing.module");
var tasks_list_component_1 = require("./tasks/tasks-list/tasks-list.component");
var tasks_edit_component_1 = require("./tasks/tasks-edit/tasks-edit.component");
var forms_1 = require("@angular/forms");
var TrackerModule = (function () {
    function TrackerModule() {
    }
    return TrackerModule;
}());
TrackerModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            tracker_routing_module_1.TrackerRoutingModule,
            forms_1.FormsModule
        ],
        declarations: [
            tasks_component_1.TasksComponent,
            tasks_list_component_1.TasksListComponent,
            tasks_edit_component_1.TasksEditComponent
        ]
    })
], TrackerModule);
exports.TrackerModule = TrackerModule;
//# sourceMappingURL=tracker.module.js.map