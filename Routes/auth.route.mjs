import { Router } from "express"
import authController from "../Controllers/auth.controller.mjs"
import { Authentication } from "../Middleware/Authentication.mjs"

const app = Router()

app.get("/login", authController.login)
app.post("/signup", authController.signup)
app.patch("/password/change", Authentication, authController.changePassword)

export default app