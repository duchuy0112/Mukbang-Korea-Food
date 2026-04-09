const nodemailer = require('nodemailer');
const MyConstants = require('./MyConstants');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: MyConstants.EMAIL_USER,
    pass: MyConstants.EMAIL_PASS
  }
});

const EmailUtil = {
  send(email, subject, text) {
    return new Promise(function (resolve, reject) {
      const mailOptions = {
        from: MyConstants.EMAIL_USER,
        to: email,
        subject: subject,
        text: text
      };

      transporter.sendMail(mailOptions, function (err, result) {
        if (err) {
          console.error('Email sending failed:', err);
          resolve(false); // Resolve to false instead of rejecting to avoid unhandled promise rejections
        } else {
          resolve(true);
        }
      });
    });
  }
};

module.exports = EmailUtil;
