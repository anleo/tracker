module.exports = function () {

    this.When(/^I click on "([^"]*)" button in navbar$/, function (arg1, callback) {
        this.iClick("nav .nav a:contains('" + arg1 + "')", callback);
    });

    this.When(/^I see "([^"]*)" in Done tasks$/, function (arg1, callback) {
        this.iSee('div.accepted li:contains("' + arg1 + '")', callback)
    });

    this.When(/^I see "([^"]*)" in In progress tasks$/, function (arg1, callback) {
        this.iSee('div.in_progress li:contains("' + arg1 + '")', callback)
    });

    this.When(/^I see "([^"]*)" in Plans tasks$/, function (arg1, callback) {
        this.iSee('div.new li:contains("' + arg1 + '")', callback);
    });

    this.Then(/^I share this task on user "([^"]*)"$/, function (arg1, callback) {
        this.chain
            .iClick("task-team-select ng-select input")
            .iClick('task-team-select ng-select ul.ui-select-choices li div:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I assign it to user "([^"]*)"$/, function (arg1, callback) {
        this.chain
            .iClick("task-assign-developer ng-select div.ui-select-container")
            .iClick('task-assign-developer ng-select ul.ui-select-choices li div:contains("' + arg1 + '")')
            .then(callback);
    });

    this.When(/^I click Report button in task menu$/, function (callback) {
        this.iClick("div.container div.pull-right a:contains(Report)", callback);
    });

    this.Then(/^I see "([^"]*)" in assigned users$/, function (arg1, callback) {
        this.iSee('div.report-page ng-select div.ui-select-container span:contains("' + arg1 + '")', callback);
    });

    this.When(/^I choose user "([^"]*)"$/, function (arg1, callback) {
        this.chain
            .iClick("ng-select div.ui-select-container")
            .iClick('ng-select div.ui-select-container div:contains("' + arg1 + '")')
            .then(callback);
    });

    this.Then(/^I don't see "([^"]*)" in Plans tasks$/, function (arg1, callback) {
        this.iDontSee('div.new li:contains("' + arg1 + '")', callback);
    });

    this.Then(/^I don't see "([^"]*)" in Done tasks$/, function (arg1, callback) {
        this.iDontSee('div.accepted li:contains("' + arg1 + '")', callback);
    });

    this.When(/^I don't see "([^"]*)" in In progress tasks$/, function (arg1, callback) {
        this.iDontSee('div.in_progress li:contains("' + arg1 + '")', callback);
    });
};