const User = require('../Models/userModel')
const sendOptToMail = require('../nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userController = {
    "userRegister": async (request, response) => {
        const existsuser = await User.findOne({ email: request.body.email })
        if (!existsuser) {
            const hassedPassword = await bcrypt.hash(request.body.password, 10)
            const newUser = new User({ ...request.body, password: hassedPassword })
            await newUser.save()
            response.status(201).json({ message: 'user addes successfully' })
        }
        else {
            response.status(200).json({ message: 'user already exisited with this email' })
        }
    },
    "userLogin": async (request, response) => {
        const existsuser = await User.findOne({ email: request.body.email })
        if (existsuser) {
            const isCorrectPassword = await bcrypt.compare(request.body.password, existsuser.password)
            if (isCorrectPassword) {
                const generateOtp = () => Math.floor(1000 + Math.random() * 9000).toString();
                const otp = generateOtp()
                const result = await sendOptToMail(existsuser.email, otp)
                if (result.success) {
                    await User.findOneAndUpdate({ email: existsuser.email }, { $set: { otp: otp } }, { new: true })
                    response.status(200).json({ userId: existsuser._id })
                } else {
                    response.status(500).json({ error: result.error });
                }
            }
            else {
                response.status(401).json({ message: 'invalid password' })
            }
        }
        else {
            response.status(200).json({ message: 'user not exisited with this email' })
        }
    },
    "otpVerification": async (request, response) => {
        const existsuser = await User.findById({ _id: request.body.user })
        const paylod = { id: existsuser._id, role: existsuser.role }
        if (existsuser.otp === request.body.otp) {
            const jwtToken = jwt.sign(paylod, process.env.JWT_KEY)
            response.status(200).json({
                token: jwtToken
            })
        }
        else {
            response.status(401).json({ message: 'invalid opt' })
        }
    }
}

module.exports = userController