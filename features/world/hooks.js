module.exports = function () {


  this.Before(function (next) {
    if (this.driver) {
      this.driver.manage().window().setSize(1000, 520).then(function () {
        this.parseText(next);
      }.bind(this));
    }
    else {
      this.parseText(next);
    }
  });

  this.After(function (next) {
    if (this.driver) {
      this.driver.quit();
    }
    next();
  });
}
