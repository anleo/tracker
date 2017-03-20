module.exports = function () {

    this.Then(/^I click on close button$/, function (callback) {
        this.chain
            .iClick("form a:contains('Close')")
            .then(callback);
    });

    this.Then(/^I click on parent task metrics to edit it$/, function (callback) {
        this.chain
            .iSee(".app-task-metrics")
            .iClick(".app-task-metrics")
            .then(callback);
    });

    this.Then(/^I see estimated time "([^"]*)" of parent task$/, function (arg1, callback) {
        this.chain
            .iSee('.app-task-metrics span.estimated-time:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I see spent time "([^"]*)" of parent task$/, function (arg1, callback) {
        this.chain
            .iSee('.app-task-metrics span.spent-time:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I see todo time "([^"]*)" of parent task$/, function (arg1, callback) {
        this.chain
            .iSee('.app-task-metrics span.todo-time:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I see complexity "([^"]*)" of parent task$/, function (arg1, callback) {
        this.chain
            .iSee('.app-task-metrics span.metrics-complexity:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I see points "([^"]*)" of parent task$/, function (arg1, callback) {
        this.chain
            .iSee('.app-task-metrics span.metrics-points:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I click back button to parent task "([^"]*)"$/, function (arg1, callback) {
        this.chain
            .iSee('.parent-back-button a:contains("' + arg1 + '")')
            .iClick('.parent-back-button a:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I see task "([^"]*)" spent time "([^"]*)"$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('div h4 a:contains("' + arg1 + '")')
            .iSee("ul.task-metrics li span:contains('" + arg2 + "')")
            .then(callback);
    });

    this.Then(/^I see parent task description "([^"]*)" for task "([^"]*)"$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('div.task-info h2:contains("' + arg2 + '")')
            .iSee('div.task-info h2:contains("' + arg2 + '") ~ task-description-viewer span.pointer:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I don't see parent task description "([^"]*)" for task "([^"]*)"$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('div.task-info h2:contains("' + arg2 + '")')
            .iDontSee('div.task-info h2:contains("' + arg2 + '") ~ task-description-viewer span.pointer:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I see description "([^"]*)" for task "([^"]*)"$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('div h4 a:contains("' + arg2 + '")')
            .iSee("task-description-viewer span.pointer:contains('" + arg1 + "')")
            .then(callback);
    });

    this.Then(/^I don't see description "([^"]*)" for task "([^"]*)"$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('div h4 a:contains("' + arg2 + '")')
            .iDontSee("task-description-viewer span.pointer:contains('" + arg1 + "')")
            .then(callback);
    });

    this.Then(/^I see task "([^"]*)" in "([^"]*)" column$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('div h3:contains("' + arg2 + '")+app-tasks-list .tasks-list h4:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I see tree view$/, function (callback) {
        this.iSee('div.task-tree panel-tree', callback)
    });

    this.Then(/^I don't see tasks in board$/, function (callback) {
        this.chain
            .iDontSee('app-tasks-board', callback)
            .iSee('div.align-center h4:contains("No active tasks.")', callback)
    });

};
