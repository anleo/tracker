module.exports = function () {

    this.Then(/^I click on close button$/, function (callback) {
        this.chain
            .iClick("form a:contains('Close')")
            .then(callback);
    });

    this.Then(/^I see task "([^"]*)" spent time "([^"]*)"$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('div h4 a:contains("' + arg1 + '")')
            .iSee("ul.task-metrics li span:contains('" + arg2 + "')")
            .then(callback);
    });

    this.Then(/^I see task "([^"]*)" in "([^"]*)" column$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('div h3:contains("' + arg2 + '")+app-tasks-list .tasks-list h4:contains("' + arg1 + '")')
            .then(callback);
    });

};
