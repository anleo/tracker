module.exports = function () {

    this.Then(/^I click on Move link$/, function (callback) {
        this.chain
            .iClick('form div.form-group a:contains("Move")')
            .then(callback);
    });

    this.Then(/^I see search input$/, function (callback) {
        this.iSee("task-move input.move-search-input", callback);
    });

    this.When(/^I type title of a searched task "([^"]*)"$/, function (arg1, callback) {
        this.iType("task-move input.move-search-input", arg1, callback);
    });

    this.Then(/^I see in a search list "([^"]*)"$/, function (arg1, callback) {
        this.iSee('ul.list-group li.list-group-item:contains("' + arg1 + '")', callback);
    });

    this.Then(/^I don't see in a search list "([^"]*)"$/, function (arg1, callback) {
        this.iDontSee('ul.list-group li.list-group-item:contains("' + arg1 + '")', callback)
    });
};