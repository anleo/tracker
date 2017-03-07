module.exports = function () {

    this.Then(/^I click register button in navbar$/, function (callback) {
        this.chain
            .iSee('.navbar.navbar-default a:contains("Register")')
            .iClick('.navbar.navbar-default a:contains("Register")')
            .then(callback);
    });

    this.Then(/^I see registration form$/, function (callback) {
        this.iSee('form.registrationForm', callback);
    });

    this.When(/^I type email "([^"]*)"$/, function (arg1, callback) {
        this.chain
            .iSee('form.registrationForm input[name="email"]')
            .iType('form.registrationForm input[name="email"]', arg1)
            .then(callback);
    });

    this.When(/^I type username "([^"]*)" in reg form$/, function (arg1, callback) {
        this.chain
            .iSee('form.registrationForm input[name="username"]')
            .iType('form.registrationForm input[name="username"]', arg1)
            .then(callback);
    });

    this.When(/^I type password "([^"]*)" in reg form$/, function (arg1, callback) {
        this.chain
            .iSee('form.registrationForm input[name="password"]')
            .iType('form.registrationForm input[name="password"]', arg1)
            .then(callback);
    });

    this.When(/^I click on register button$/, function (callback) {
        this.chain
            .iSee('form.registrationForm button[type="submit"]')
            .iClick('form.registrationForm  button[type="submit"]')
            .then(callback);
    });


};
