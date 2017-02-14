var Mailer = function (config) {

    var nodemailer = require('nodemailer');

    // var transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: config.get('mailer.sender'),
    //         pass: config.get('mailer.password')
    //     }
    // });


    var aws = require('aws-sdk');
    var transporter = nodemailer.createTransport({
        SES: new aws.SES({apiVersion: '2010-12-01'})
    });


    this.send = function (mail, callback) {
        transporter.sendMail({
            from: mail.from || config.get('mailer.sender'),
            to: mail.to,
            subject: mail.subject,
            text: mail.text
        }, function (err, info) {
            callback(err, info);
        });
    }
};

module.exports = Mailer;