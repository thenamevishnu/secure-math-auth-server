import bcrypt from "bcrypt"
import { authDB } from "../Models/auth.model.mjs"
import jwt from "jsonwebtoken"
import env from "dotenv"
import { Types } from "mongoose"

env.config()

const signup = async (req, res) => {
    try {
        const { username, password, confirm_password } = req.body
        if (!username) {
            return res.status(400).send({
                message: "username is empty"
            })
        }
        if (!password) {
            return res.status(400).send({
                message: "password is empty"
            })
        }
        if (!confirm_password) {
            return res.status(400).send({
                message: "confirm password is empty"
            })
        }
        if (password != confirm_password) {
            return res.status(422).send({
                message: "passwords does not match"
            })
        }
        const findUser = await authDB.findOne({
            username: username
        })
        if (findUser) {
            return res.status(409).send({
                message: "username already exist"
            })
        }
        const encryptedPassword = await bcrypt.hash(password, 10)
        const response = await authDB.create({
            username: username,
            password: encryptedPassword
        })
        if (response._id) {
            return res.status(201).send({
                result: response._id,
                message: "new user created"
            })
        }
        return res.status(500).send({
            message: "unknown error"
        })
    } catch (err) {
        return res.status(500).send({
            message: err.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.query
        if (!username) {
            return res.status(400).send({
                message: "username is empty"
            })
        }
        if (!password) {
            return res.status(400).send({
                message: "password is empty"
            })
        }
        const findUser = await authDB.findOne({
            username: username
        })
        if (!findUser) {
            return res.status(404).send({
                message: "user not found"
            })
        }
        const passwordValidate = await bcrypt.compare(password, findUser.password)
        if (!passwordValidate) {
            return res.status(401).send({
                message: "Invalid credentials"
            })
        }
        const token = jwt.sign({ id: findUser._id }, process.env.AUTH_JWT_KEY, {
            expiresIn: "7d"
        })
        return res.status(200).send({
            token: token,
            message: "success"
        })
    } catch (err) {
        return res.status(500).send({
            message: err.message
        })
    }
}

const changePassword = async (req, res) => {
    try {
        const { user_id, currentPassword, newPassword } = req.body
        if (!user_id) {
            return res.status(400).send({
                message: "user_id is empty"
            })
        }
        if (!currentPassword) {
            return res.status(400).send({
                message: "current password is empty"
            })
        }
        if (!newPassword) {
            return res.status(400).send({
                message: "new password is empty"
            })
        }
        const findUser = await authDB.findOne({
            _id: user_id
        })
        if (!findUser) {
            return res.status(404).send({
                message: "user not found"
            })
        }
        const checkCurrentPassword = await bcrypt.compare(currentPassword, findUser.password)
        if (!checkCurrentPassword) {
            return res.status(400).send({
                message: "Current password is not correct"
            })
        }
        const isCurrentPassword = await bcrypt.compare(newPassword, findUser.password)
        if (isCurrentPassword) {
            return res.status(400).send({
                message: "New password cannot be the same as the current password"
            })
        }
        const encryptedPassword = await bcrypt.hash(newPassword, 10)
        const response = await authDB.updateOne({
            _id: user_id
        }, {
            $set: {
                password: encryptedPassword
            }
        })
        if (response.matchedCount == 1 && response.modifiedCount == 1) {
            return res.status(200).send({
                message: "success"
            })
        }
        return res.status(500).send({
            message: "unknown error"
        })
    } catch (err) {
        return res.status(500).send({
            message: err.message
        })
    }
}

export default {
    login,
    signup,
    changePassword
}