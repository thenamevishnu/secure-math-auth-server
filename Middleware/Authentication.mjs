import jwt from "jsonwebtoken"
import env from "dotenv"

env.config()

export const Authentication = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]
        if (!token) {
            return res.status(401).send({
                message: "Authorization failed"
            })
        }
        const jwtToken = token.split(" ")?.[1]
        if(!jwtToken){
            return res.status(401).send({
                message: "Authorization failed"
            })
        }
        const auth = jwt.verify(jwtToken, process.env.AUTH_JWT_KEY)
        const now = Math.floor(new Date().getTime() / 1000)
        if (auth.exp <= now) {
            return res.status(401).send({
                message: "Authorization failed"
            })
        }
        next()
    } catch (err) {
        return res.status(500).send({
            message: "Internal server error"
        })
    }
}