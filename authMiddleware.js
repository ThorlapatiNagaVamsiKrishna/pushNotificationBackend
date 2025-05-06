const jwt = require('jsonwebtoken')
const Authorization = async (request, response, next) => {
    const jwtToken = request["headers"].authorization.split(' ')[1]
    if (jwtToken) {
        jwt.verify(jwtToken, process.env.SECRET_KEY, (error, payload) => {
            if (error) {
                response.status(401).json({ message: error.message })
            }
            else {
                request.payload = payload
                next()
            }
        })
    } else {
        response.status(401).json({ message: 'invalid access token' })
    }
}

module.exports = Authorization