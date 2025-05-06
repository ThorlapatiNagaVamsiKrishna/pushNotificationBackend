const nodemailer = require('nodemailer')
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "thorlapatinagavamsikrishna@gmail.com",
        pass: process.env.MAIL_KEY,
    },
});

const sendOptToMail = async (email, otp) => {
    try {
        const mailOptions = {
            from: '"Your App Name" <thorlapatinagavamsikrishna@gmail.com>',
            to: email,
            subject: "Your OTP Code",
            html: `
            <div style="font-family: Arial, sans-serif; text-align: center;">
              <h2>OTP Verification</h2>
              <p>Your OTP code is:</p>
              <h1 style="color: #2e59d9;">${otp}</h1>
              <p>It will expire in 10 minutes.</p>
            </div>
          `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log(info.response);
        return { success: true }
    } catch (error) {
        console.error("Error sending OTP email:", error);
        return { success: false }
    }


}

module.exports = sendOptToMail