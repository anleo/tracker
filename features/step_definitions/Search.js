module.exports = function () {

    this.Then(/^I see task "([^"]*)"$/, function (arg1, callback) {
        this.iSee(".board-view a:contains('" + arg1 + "')", callback);
    });

    this.Then(/^I click on task link "([^"]*)"$/, function (arg1, callback) {
        this.iClick(".container .board-view a:contains('" + arg1 + "')", callback);
    });

    this.Then(/^I see search form$/, function (callback) {
        this.iSee(".nav task-search", callback);
    });

    this.When(/^I search "([^"]*)"$/, function (arg1, callback) {
        this.iType(".nav task-search input[name='query']", arg1, callback);
    });

    this.When(/^I clear search input$/, function (callback) {
        this.iPressBackspace(".nav task-search input[name='query']", callback);
    });

    this.Then(/^I don't see task "([^"]*)"$/, function (arg1, callback) {
        this.iDontSee(".board-view a:contains('" + arg1 + "')", callback)
    });


    this.Then(/^I am on "([^"]*)" page$/, function (arg1, callback) {
        this.iSee(".container .task-info h2:contains('" + arg1 + "')", callback)
    });

    this.When(/^I don't see search form$/, function (callback) {
        this.iDontSee(".nav task-search input[name='query']", callback);
    });

    this.Then(/^I click projects$/, function (callback) {
        this.iClick(".nav a:contains(Projects)", callback)

    });

    this.Then(/^I edit this task in layout$/, function (callback) {
        this.chain
            .iClick('ul.task-metrics')
            .iSee('app-task-edit form')
            .then(callback);
    });

    this.Then(/^I edit this task in modal$/, function (callback) {
        this.chain
            .iClick('.task-info div[task-metrics]')
            .iSee('.modal-box div[task-editor]')
            .then(callback);
    });

    this.Then(/^I tag this task with "([^"]*)"$/, function (arg1, callback) {
        this.chain
            .iType('app-task-edit form task-tags div.addTag input', arg1)
            .iClick('app-task-edit form task-tags div.addTag button')
            .iClick("app-task-edit form task-tags ng-select input")
            .iClick('app-task-edit form task-tags ng-select ul.ui-select-choices li div:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I save task$/, function (callback) {
        this.iClick('app-task-edit form button:contains(Save)', callback);
    });

    this.Then(/^I switch metrics settings$/, function (callback) {
        this.iClick('app-tasks-board button.btn-metrics', callback);
    });

    this.Then(/^I see task with tag "([^"]*)"$/, function (arg1, callback) {
        this.iSee('app-task-panel task-tags-panel a:contains("' + arg1 + '")', callback);
    });

    this.Then(/^I click on edit button of task "([^"]*)"$/, function (arg1, callback) {
        this.iClick('a:contains("' + arg1 + '") + span.editTaskButton', callback);
    });

    this.Then(/^I see edit form$/, function (callback) {
        this.iSee('app-task-edit form', callback);
    });

    this.Then(/^I see title field$/, function (callback) {
        this.iSee('app-task-edit form input[name="title"]', callback);
    });

    this.Then(/^I type "([^"]*)"$/, function (arg1, callback) {
        this.iType('app-task-edit form input[name="title"]', arg1, callback);
    });

    this.Then(/^I reload page$/, function (callback) {
        this.iReload(callback);
    });

};