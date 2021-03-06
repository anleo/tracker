module.exports = function () {

    this.Then(/^I see task title input$/, function (callback) {
        this.iSee("form input[name='title']", callback);
    });

    this.When(/^I type task title "([^"]*)"$/, function (arg1, callback) {
        this.iType("form input[name='title']", arg1, callback);
    });

    this.Then(/^I see task form$/, function (callback) {
        this.iSee("form textarea[name='description']", callback);
    });

    this.Then(/^I see task complexity buttons$/, function (callback) {
        this.iSee("form div.complexity", callback);
    });

    this.Then(/^I click on task complexity "([^"]*)"$/, function (arg1, callback) {
        this.iClick("form .btn-group label.complexityButton:contains('" + arg1 + "')", callback);
    });

    this.Then(/^I click on save button$/, function (callback) {
        this.chain
            .iClick("form button:contains('Save')")
            .then(callback);
    });

    this.Then(/^I see task complexity "([^"]*)"$/, function (arg1, callback) {
        this.iSee("ul.task-metrics li[tooltip='Complexity / Points']:contains('" + arg1 + "')", callback);
    });

    this.Then(/^I see task "([^"]*)" complexity "([^"]*)"$/, function (arg1, arg2, callback) {
        this.chain
            .iSee(' div h4 a:contains("' + arg1 + '")')
            .iSee("ul.task-metrics li[tooltip='Complexity / Points']:contains('" + arg2 + "')")
            .then(callback);
    });

    this.Then(/^I click on task status "([^"]*)"$/, function (arg1, callback) {
        this.iClick("form div.btn-group button.taskStatusButton:contains('" + arg1 + "')", callback);
    });

    this.Then(/^I click task spent time "([^"]*)"$/, function (arg1, callback) {
        this.iClick("form div.btn-group label.addTimeButton:contains('" + arg1 + "')", callback);
    });

    this.Then(/^I see task "([^"]*)" velocity "([^"]*)"$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('.board-view a:contains("' + arg1 + '")')
            .iSee('.board-view ul li[tooltip="Velocity"]:contains("' + arg2 + '")')
            .then(callback);
    });

    this.Then(/^I see task "([^"]*)" estimated time "([^"]*)" tooltip "([^"]*)"$/, function (arg1, arg2, arg3, callback) {
        this.chain
            .iSee('.board-view a:contains("' + arg1 + '")')
            .iSee('.board-view ul li span[ng-reflect-tooltip="Estimated ' + arg3 + '"]:contains("' + arg2 + '")')
            .then(callback);
    });

    this.Then(/^I click back to project "([^"]*)"$/, function (arg1, callback) {
        this.iClick('div.task-info a.project-link:contains("' + arg1 + '")', callback);
    });

    this.Then(/^I see parent "([^"]*)" estimated time "([^"]*)" tooltip "([^"]*)"$/, function (arg1, arg2, arg3, callback) {
        this.chain
            .iSee('div.task-info h2:contains("' + arg1 + '")')
            .iSee('div.task-info app-task-metrics li span[ng-reflect-tooltip="Estimated ' + arg3 + '"]:contains("' + arg2 + '")')
            .then(callback);
    });

    this.Then(/^I see parent "([^"]*)" complexity "([^"]*)"$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('div.task-info h2:contains("' + arg1 + '")')
            .iSee('div.task-info app-task-metrics li[tooltip="Complexity / Points"]:contains("' + arg2 + '")')
            .then(callback);
    });

    this.When(/^I set max metrics details$/, function (callback) {
        this.chain
            .iClick('.task-views-block button.btn-metrics')
            .iClick('.task-views-block button.btn-metrics')
            .iSee('.task-views-block button.btn-metrics.btn-info')
            .then(callback);
    });

};