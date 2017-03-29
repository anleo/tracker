var UserService = function (User) {
    this.getUserId = function (user) {
        return user._id || user || "";
    };

    this.getUsers = function (users, next) {
        User
            .find({_id: {$in: users}}, '-local.passwordHashed -local.passwordSalt')
            .exec(next);
    }
};

module.exports = UserService;