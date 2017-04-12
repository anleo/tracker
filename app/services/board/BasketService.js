let BasketService = function (Board) {
    let _ = require('lodash');


    this.create = function (req) {
        return new Promise(function (resolve, reject) {
            let basket = new Board();
            basket.owner = req.user;
            basket.title = "Basket 22.03";
            basket.type = "basket";

            basket
                .save()
                .then((basket) => {
                    resolve(basket);
                }, (err) => reject(err));
        });
    };

};
module.exports = BasketService;
