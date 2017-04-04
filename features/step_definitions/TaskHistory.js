module.exports = function () {

    this.When(/^I click on details link$/, function (callback) {
        this.iClick("div.task-info a:contains('Details')", callback);
    });

    this.Then(/^I see comment message input$/, function (callback) {
        this.iSee("comments form textarea[name='text']", callback);
    });

    this.Then(/^I see history message "([^"]*)"$/, function (arg1, callback) {
        this.iSee('p.history-message:contains("' + arg1 + '")', callback);
    });

    this.Then(/^I type description "([^"]*)"$/, function (arg1, callback) {
        this.iType("form textarea[name='description']", arg1, callback);
    });

    this.Then(/^I type comment "([^"]*)"$/, function (arg1, callback) {
        this.iType("comments form textarea[name='text']", arg1, callback);
    });

    this.Then(/^I see task "([^"]*)" comments number "([^"]*)"$/, function (arg1, arg2, callback) {
        this.chain
            .iSee('h2:contains("' + arg1 + '")')
            .iSee(' ul.detail-line li span[tooltip="Comments"]:contains("' + arg2 + '")')
            .then(callback);
    });

    this.Then(/^I click on "([^"]*)" filter  button$/, function (arg1, callback) {
        this.chain
            .iClick('div.board-buttons button:contains("' + arg1 + '")')
            .then(callback);
    });
};