const jwt = require('jsonwebtoken')

const auth = (req, res, next )=> {
  try {
    const token = req.headers.authorization.split(' ')[1]
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    req.userData = {email: decodedToken.emial ,userId: decodedToken.userId}
		next()

	} catch (e) {
		return res.status(401).json({message:'You are not authenticated!'})
	}
}

module.exports = auth
