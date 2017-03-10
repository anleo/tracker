module.exports = function () {
    this.Then(/^I click on task tag "([^"]*)"$/, function (arg1, callback) {
        this.iClick('app-task-panel task-tags-panel a:contains("' + arg1 + '")', callback);
    });
};